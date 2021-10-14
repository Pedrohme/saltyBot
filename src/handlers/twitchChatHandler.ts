import tmi, { client } from 'tmi.js';
import pg from 'pg';
import {dbHandler} from './dbHandler';

export class twitchChatHandler {
    tmiClient:tmi.Client;
    lastFighterA:string;
    lastFighterB:string;

    constructor (options:any) {
        this.tmiClient = new tmi.Client(options);
        this.lastFighterA = "";
        this.lastFighterB = "";
    }
    
    async connect() {
        try {
            await this.tmiClient.connect();
            console.log("Twitch channel connected!");
            return true;
        }
        catch (err) {
            console.log((<Error>err).stack);
            return false;
        }
    }

    startMessageWatcher(dbHandler:dbHandler) {
        console.log("Starting to listen!");
        this.tmiClient.on('message', async (channel, tags, message, self) => {
            if (tags.username === 'waifu4u') {
                const betsPos = message.indexOf("Bets are OPEN for");
                const exhibition = message.indexOf("(exhibition)");
                if (betsPos !== -1 && exhibition === -1) {
                    const sliced = message.slice(betsPos).trim();
                    const vspos = sliced.indexOf('vs');
                    const tierpos = sliced.search(/\(. Tier\)/);
                    this.lastFighterA = sliced.slice(18, vspos-1);
                    this.lastFighterB = sliced.slice(vspos+3, tierpos-2);

                    console.log(`fighter A = ${this.lastFighterA} fighter B = ${this.lastFighterB}`);
        
                    const valuesA = [this.lastFighterA];
                    const resA = await dbHandler.selectFighter(valuesA);
                    if (resA !== null) {
                        const result:pg.QueryResult = (<pg.QueryResult>resA);
                        if (result.rowCount === 0) {
                            const insertValues = [this.lastFighterA, 0 ,0];
                            await dbHandler.insertFighter(insertValues);
                        }
                    }
        
                    const valuesB = [this.lastFighterB];
                    const resB = await dbHandler.selectFighter(valuesB);
                    if (resB !== null) {
                        const result:pg.QueryResult = (<pg.QueryResult>resB);
                        if (result.rowCount === 0) {
                            const insertValues = [this.lastFighterB, 0 ,0];
                            await dbHandler.insertFighter(insertValues);
                        }
                    }
                }
                else if (exhibition === -1) {
                    const winsPos = message.indexOf("wins!");
                    if (winsPos != -1) {
                        const winner = message.slice(0, winsPos-1);
                        let loser = "";
                        let flagError = false;
                        if (winner === this.lastFighterA) {
                            loser = this.lastFighterB;
                            console.log(`winner = ${winner} loser = ${loser}`);
                        }
                        else if (winner === this.lastFighterB) {
                            loser = this.lastFighterA;
                            console.log(`winner = ${winner} loser = ${loser}`);
                        }
                        else {
                            console.log('Fighter not found');
                            flagError = true;
                        }

                        if (!flagError) {
                            const values = [this.lastFighterA, this.lastFighterB, winner];
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