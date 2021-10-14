import { twitchChatHandler } from './handlers/twitchChatHandler';
import { dbHandler } from './handlers/dbHandler';

const tmiOptions = {
    connection: {
        secure: true,
        reconnect: true
    },
    channels: ['saltybet']
};

const db = new dbHandler({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const twitch = new twitchChatHandler(tmiOptions);

async function main() {
    const twitchConnection = await twitch.connect();
    if (twitchConnection) {
        console.log("ready to start listening!");
        twitch.startMessageWatcher(db);
    }
}

main();

