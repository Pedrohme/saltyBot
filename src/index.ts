import { twitchChatHandler } from './handlers/twitchChatHandler';

const tmiOptions = {
    connection: {
        secure: true,
        reconnect: true
    },
    channels: ['saltybet'],
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

