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

const pHandler = new dbHandler(dbConnect.postgres);
const tHandler = new twitchChatHandler(tmiOptions);

tHandler.startMessageWatcher(pHandler);

