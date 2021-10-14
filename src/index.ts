import dbConnect from './config/config.json';
import { twitchChatHandler } from './handlers/twitchChatHandler';
import { dbHandler } from './handlers/dbHandler';

const tmiOptions = {
    connection: {
        secure: true,
        reconnect: true
    },
    channels: ['saltybet']
};

const db = new dbHandler(dbConnect.postgres);
const twitch = new twitchChatHandler(tmiOptions);

async function main() {
    const dbConnection = await db.connect();
    const twitchConnection = await twitch.connect();
    if (dbConnection && twitchConnection) {
        console.log("ready to start listening!");
        twitch.startMessageWatcher(db);
    }
}

main();

