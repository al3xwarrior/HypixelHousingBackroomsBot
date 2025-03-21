const mineflayer = require('mineflayer');
const {pathfinder, goals: { GoalNear }} = require('mineflayer-pathfinder');
const { initEvents } = require('./events');
//const mineflayerViewer = require('prismarine-viewer').mineflayer;

const config = {
    // Bot Information
    bot_username: 'USERNAME',
    bot_password: 'PASSWORD',

    // Owner Username
    owner_username: 'Al3xWarrior',

    // Arena Size
    bot_x_maximum: 9999,
    bot_x_minimum: -9999,

    bot_y_maximum: 9999,
    bot_y_minimum: -9999,

    bot_z_maximum: 9999,
    bot_z_minimum: -9999,
};

const dividerString = '---------------------------------';
const minecraftbotoptions = {
    host: 'hypixel.net', // minecraft server ip
    username: config.bot_username, // minecraft username
    password: config.bot_password, // minecraft password, comment out if you want to log into online-mode=false servers
    version: '1.8.9', // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
    auth: 'microsoft', // only set if you need microsoft auth, then set this to 'microsoft'
};

var pathfind = false;
var targetfound = false;
var botSpeed;
var bootCheck = 0;

var bot = mineflayer.createBot(minecraftbotoptions);
bot.loadPlugin(pathfinder);
initEvents(bot);

bot.on('chat', (username, message) => {
    console.log(username, message);
    if (username != config.owner_username) {
        return;
    }
    if (message.includes('start')) {
        bot.chat('/visibility 150');
        pathfind = true;
    } else if (message.includes('stop')) {
        pathfind = false;
    } else if (message.includes('party')) {
        bot.chat('/p join' + config.owner_username);
    }
});

bot.on('message', (jsonMsg) => {
    const message = jsonMsg.toString();

    if (message.includes('Easy Monster')) {
        bot.chat('/easymode');
        console.log('Easy Mode Activated');
    } else if (message.includes('Medium Monster')) {
        bot.chat('/mediummode');
        console.log('Medium Mode Activated');
    } else if (message.includes('Hard Monster')) {
        bot.chat('/hardmode');
        console.log('Hard Mode Activated');
    }
});

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function inHouse() {
    const footer = bot.tablist.footer.toString();

    if (!footer.includes('You are in')) {
        pathfind = false;
        console.log('Disconnected from the House!! Attempting to rejoin...');
        setTimeout(() => {
            bot.chat('/l housing');
            setTimeout(() => {
                bot.chat('/visit ' + config.owner_username);
            }, 1000);
        }, 1000);
    }
}

function targetInformation(entity) {
    console.log('  [ TARGET INFORMATION: ]');
    console.log('Username: ' + entity.username);

    const targetEquipment = entity.equipment;
    //const item = targetEquipment[1];

    console.log('Position: ' + Math.round(entity.position.x) + 'x ' + Math.round(entity.position.y) + 'y ' + Math.round(entity.position.z) + 'z');
}

function botInformation(bot) {
    console.log('  [ BOT INFORMATION: ]');
    if (bot.entity.effects[1]) {
        botSpeed = bot.entity.effects[1].amplifier + 1;
        console.log('Speed Level: ' + botSpeed);
    } else {
        console.log('Speed Level: 0');
    }
}

setInterval(function () {
    inHouse();
    if (!pathfind) {
        return;
    }

    // Make sure the bot is within bounds of the arena, is targetting a player, and that player is not the carpenter
    const entity = bot.nearestEntity((e) => 
        e.type === 'player' && 
        e.username.toLowerCase != 'Carpenter' && 
        Math.round(e.position.y) < config.bot_y_maximum && 
        Math.round(e.position.y) > config.bot_y_minimum && 
        Math.round(e.position.z) > config.bot_z_minimum &&
        Math.round(e.position.z) < config.bot_z_maximum &&
        Math.round(e.position.x) > config.bot_x_maximum &&
        Math.round(e.position.x) < config.bot_x_maximum
    );

    if (entity) {
        if (entity.type != 'player') {
            return;
        }
        console.log(entity);
        targetfound = true;
        bootCheck += 0.5;

        console.log(dividerString);
        targetInformation(entity);
        console.log(' ');
        botInformation(bot);
        console.log('Position: ' + Math.round(bot.entity.position.x) + 'x ' + Math.round(bot.entity.position.y) + 'y ' + Math.round(bot.entity.position.z) + 'z');
        console.log(dividerString);

        const { x: playerX, y: playerY, z: playerZ } = entity.position;
        bot.pathfinder.setGoal(new GoalNear(playerX, playerY, playerZ, 1));
    } else {
        targetfound = false;
        console.log('No target found! Moving randomly');
        bot.pathfinder.setGoal(new GoalNear(randomNumber(config.bot_x_minimum, config.bot_x_maximum), randomNumber(config.bot_y_minimum, config.bot_y_maximum), randomNumber(config.bot_z_minimum, config.bot_z_maximum), 1));
    }
}, 500);

module.exports = {
    config
}