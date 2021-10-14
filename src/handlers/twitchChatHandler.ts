import tmi from 'tmi.js';
import pg from 'pg';
import {dbHandler} from './dbHandler';

export class twitchChatHandler {
    tmiClient:tmi.Client;

    constructor (options:any) {
        this.tmiClient = new tmi.Client(options);
        this.tmiClient.connect();
    }

    startMessageWatcher(dbHandler:dbHandler) {
        let fighterA = "";
        let fighterB = "";
        this.tmiClient.on('message', async (channel, tags, message, self) => {
            if (tags.username === 'waifu4u') {
                let pos = message.search("Bets are OPEN for");
                if (pos != -1) {
                    let sliced = message.slice(pos);
                    sliced = sliced.trim();
                    const vspos = sliced.search('vs');
                    const tierpos = sliced.search('(. Tier)');
                    fighterA = sliced.slice(18, vspos-1);
                    fighterB = sliced.slice(vspos+3, tierpos-3);
                    console.log(`fighter A = ${fighterA} fighter B = ${fighterB}`);
        
                    const valuesA = [fighterA];
                    const resA = await dbHandler.selectFighter(valuesA);
                    if (resA !== null) {
                        const result:pg.QueryResult = (<pg.QueryResult>resA);
                        if (result.rowCount === 0) {
                            const insertValues = [fighterA, 0 ,0];
                            await dbHandler.insertFighter(insertValues);
                        }
                    }
        
                    const valuesB = [fighterB];
                    const resB = await dbHandler.selectFighter(valuesB);
                    if (resB !== null) {
                        const result:pg.QueryResult = (<pg.QueryResult>resB);
                        if (result.rowCount === 0) {
                            const insertValues = [fighterB, 0 ,0];
                            await dbHandler.insertFighter(insertValues);
                        }
                    }
                }
                else {
                    pos = message.search("wins!");
                    if (pos != -1) {
                        const winner = message.slice(0, pos-1);
                        let loser = "";
                        console.log(`winner = ${winner}`);
                        let flagError = false;
                        if (winner === fighterA) {
                            loser = fighterB;
                            console.log(`winner = ${winner} loser = ${loser}`);
                        }
                        else if (winner === fighterB) {
                            loser = fighterA;
                            console.log(`winner = ${winner} loser = ${loser}`);
                        }
                        else {
                            console.log('error');
                            flagError = true;
                        }
                        if (!flagError) {
                            const values = [fighterA, fighterB, winner];
                            await dbHandler.insertFight(values);
        
                            const updateValuesWin = [1, 0, winner];
                            await dbHandler.updateFighter(updateValuesWin);
        
                            const updateValuesLoser = [0, 1, loser];
                            await dbHandler.updateFighter(updateValuesLoser);
                        }
                    }
                }
        
            }
        })
    }
}