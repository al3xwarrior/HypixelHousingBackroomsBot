const { Movements } = require('mineflayer-pathfinder');
const { config } = require("./index");

function initEvents(bot) {
    bot.on('windowOpen', (window) => {
        window.requiresConfirmation = false;
        setTimeout(() => {
            bot.clickWindow(14, 1, 0);
        }, 1000);
    });

    bot.once('spawn', () => {
        const defaultMove = new Movements(bot)
        bot.pathfinder.setMovements(defaultMove)

        //mineflayerViewer(bot, { firstPerson: false, port: 3000 }) // Start the viewing server on port 3000
        setTimeout(() => {
            bot.chat("/l housing");
            setTimeout(() => {
                bot.chat("/visit " + config.owner_username);
            }, 1000);
        }, 1000);
    });

    bot.on('kicked', (reason, loggedIn) => {
        console.warn(reason, loggedIn)
        setTimeout(() => {
            bot = mineflayer.createBot(minecraftbotoptions);
            initEvents(bot);
        }, 5000);
    });
    bot.on('end', (reason) => {
        console.warn(reason);
        setTimeout(() => {
            bot = mineflayer.createBot(minecraftbotoptions);
            initEvents(bot);
        }, 5000);
    });
    bot.on('error', (err) => {
        console.warn(err);
        setTimeout(() => {
            bot = mineflayer.createBot(minecraftbotoptions);
            initEvents(bot);
        }, 5000);
    });
}

module.exports = {
    initEvents
}