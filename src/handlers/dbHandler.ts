import pg from 'pg';

const selectFighter = "SELECT * FROM fighter WHERE name = $1";
const insertFighter = "INSERT INTO fighter(name, wins, losses) VALUES($1, $2, $3)";
const insertFight = "INSERT INTO fights(fightera, fighterb, winner) VALUES($1, $2, $3)";
const updateFighter = "UPDATE fighter SET wins = wins+$1, losses = losses+$2 WHERE name = $3";

export class dbHandler {
    dbPool: pg.Pool;

    constructor(connectionInfo:any) {
        this.dbPool = new pg.Pool(connectionInfo);
    }
    
    async insertFighter(values:(string|number)[]) {
        try {
            const res = await this.dbPool.query(insertFighter, values);
            return res;
        }
        catch (err) {
            console.log((<Error>err).stack);
            return null;
        }
    }

    async selectFighter(values:string[]) {
        try {
            const res = await this.dbPool.query(selectFighter, values);
            return res;
        }
        catch (err) {
            console.log((<Error>err).stack);
            return null;
        }
    }
    
    async insertFight(values:string[]) {
        try {
            const res = await this.dbPool.query(insertFight, values);
            return res;
        }
        catch (err) {
            console.log((<Error>err).stack);
            return null;
        }
    }
    
    async updateFighter(values:(number|string)[]) {
        try {
            const res = await this.dbPool.query(updateFighter, values);
            return res;
        }
        catch (err) {
            console.log((<Error>err).stack);
            return null;
        }
    }
}