import tmi from 'tmi.js';
import dbHandler from './dbHandler';

export class twitchChatHandler {
    tmiClient:tmi.Client;
    lastFighterA:string;
    lastFighterB:string;
    db:dbHandler;

    constructor (options:any) {
        this.tmiClient = new tmi.Client(options);
        this.lastFighterA = "";
        this.lastFighterB = "";
        this.db = options.db;
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

    startMessageWatcher() {
        console.log("Starting to listen!");
        this.tmiClient.on('message', async (channel, tags, message, self) => {
            if (tags.username === 'waifu4u') {
                const betsPos = message.indexOf("Bets are OPEN for");
                const exhibition = message.indexOf("(exhibitions)");
                if (betsPos !== -1 && exhibition === -1) {
                    const sliced = message.slice(betsPos).trim();
                    const vspos = sliced.indexOf('vs');
                    const tierpos = sliced.search(/\(. Tier\)/);
                    this.lastFighterA = sliced.slice(18, vspos-1);
                    this.lastFighterB = sliced.slice(vspos+3, tierpos-2);

                    console.log(`fighter A = ${this.lastFighterA} fighter B = ${this.lastFighterB}`);
        
                    const valuesA = [this.lastFighterA];
                    const resA = await this.db.selectFighter(valuesA);
                    if (resA !== null) {
                        if (resA.statusCode === 204) {
                            const insertValues = [this.lastFighterA, 0 ,0];
                            await this.db.insertFighter(insertValues);
                        }
                        else if (resA.statusCode === 400) {
                            console.log("Request error");
                        }
                    }
        
                    const valuesB = [this.lastFighterB];
                    const resB = await this.db.selectFighter(valuesB);
                    if (resB !== null) {
                        if (resB.statusCode === 204) {
                            const insertValues = [this.lastFighterB, 0 ,0];
                            await this.db.insertFighter(insertValues);
                        }
                        else if (resB.statusCode === 400) {
                            console.log("Request error");
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
                            await this.db.insertFight(values);
        
                            const updateValuesWin = [1, 0, winner];
                            await this.db.updateFighter(updateValuesWin);
        
                            const updateValuesLoser = [0, 1, loser];
                            await this.db.updateFighter(updateValuesLoser);
                        }
                    }
                }
            }
        })
    }
}