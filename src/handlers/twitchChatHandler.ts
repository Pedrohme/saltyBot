import tmi from 'tmi.js';
import dbHandler from './dbHandler';

export class twitchChatHandler {
    tmiClient:tmi.Client;
    lastFighterA:string;
    lastFighterB:string;
    lastTier:string;
    db:dbHandler;

    constructor (options:any) {
        this.tmiClient = new tmi.Client(options);
        this.lastFighterA = "";
        this.lastFighterB = "";
        this.lastTier = "";
        this.db = new dbHandler();
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

                // new fight is starting and is not exhibition
                if (betsPos !== -1 && exhibition === -1) {
                    await this.betsAreOpen(betsPos, message);
                }
                // fight has ended and is not exhibition
                else if (exhibition === -1) {
                    const winsPos = message.indexOf("wins!");
                    if (winsPos != -1) {
                        await this.wins(winsPos, message);
                    }
                }
            }
        });
    }

    //Process "Bets are OPEN" message
    private async betsAreOpen(betsPos:number, message:string) {
        await this.updateFighters(betsPos, message);
        await this.getAndInsertFighter(this.lastFighterA, this.lastTier);
        await this.getAndInsertFighter(this.lastFighterB, this.lastTier);
        await this.db.updateIndexPage(this.lastFighterA, this.lastFighterB, this.lastTier);
    }

    private async updateFighters(betsPos:number, message:string) {
        const sliced = message.slice(betsPos).trim();
        const vspos = sliced.indexOf('vs');
        const tierpos = sliced.search(/\(. Tier\)/);
        this.lastFighterA = sliced.slice(18, vspos-1);
        this.lastFighterB = sliced.slice(vspos+3, tierpos-2);
        this.lastTier = sliced.charAt(tierpos+1);
        console.log(`fighter A = |${this.lastFighterA}| fighter B = |${this.lastFighterB}| tier = ${this.lastTier}`);
        return [this.lastFighterA, this.lastFighterB];
    }

    private async getAndInsertFighter(fighter:string, tier:string) {
        const values = [fighter, tier];
        const res = await this.db.selectFighter(values);
        if (res) {
            if (res.statusCode === 204) {
                console.log(`${fighter} not found, trying to insert in database...`);
                const insertValues = [fighter, tier];
                const inserted = await this.db.insertFighter(insertValues);
                if (inserted) {
                    console.log(inserted.body);
                }
                else {
                    console.log(`unknown error inserting ${fighter}`);
                }
            }
            else {
                console.log(res.body);
            }
        }
        else {
            console.log("unknown error getting fighter");
        }
    }

    //Process "wins!" message
    private async wins(winsPos:number, message:string) {
        const {flagError, winner, loser} = await this.getWinnerAndLoser(winsPos, message);
        if (!flagError) {
            await this.insertFightUpdateFighters(winner, loser);
        }
    }

    private async getWinnerAndLoser(winsPos:number, message:string) {
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
            console.log(`Fight winner ${winner} doesn't match`);
            flagError = true;
        }
        return {flagError: flagError, winner: winner, loser: loser};
    }

    private async insertFightUpdateFighters(winner:string, loser:string) {
        const values = [this.lastTier, this.lastFighterA, this.lastFighterB, winner];
        let res = await this.db.insertFight(values);
        if (res) {
            console.log(res.body);
        }
        else {
            console.log("unknown error inserting fight");
        }

        const updateValuesWin = [1, 0, winner, this.lastTier];
        res = await this.db.updateFighter(updateValuesWin);
        if (res) {
            console.log(res.body);
        }
        else {
            console.log(`unknown error updating ${winner}`);
        }

        const updateValuesLoser = [0, 1, loser, this.lastTier];
        res = await this.db.updateFighter(updateValuesLoser);
        if (res) {
            console.log(res.body);
        }
        else {
            console.log(`unknown error updating ${loser}`);
        }
    }
}