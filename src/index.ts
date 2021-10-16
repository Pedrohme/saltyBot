import { twitchChatHandler } from './handlers/twitchChatHandler';
import dbHandler from './handlers/dbHandler';

const tmiOptions = {
    connection: {
        secure: true,
        reconnect: true
    },
    channels: ['saltybet'],
    db: new dbHandler()
};

const twitch = new twitchChatHandler(tmiOptions);

async function main() {
    const twitchConnection = await twitch.connect();
    if (twitchConnection) {
        console.log("ready to start listening!");
        twitch.startMessageWatcher();
    }
}

main();

