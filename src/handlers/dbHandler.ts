import { throws } from 'assert';
import pg from 'pg';

const selectFighter = "SELECT * FROM fighter WHERE name = $1";
const insertFighter = "INSERT INTO fighter(name, wins, losses) VALUES($1, $2, $3)";
const insertFight = "INSERT INTO fights(fightera, fighterb, winner) VALUES($1, $2, $3)";
const updateFighter = "UPDATE fighter SET wins = wins+$1, losses = losses+$2 WHERE name = $3";

export class dbHandler {
    dbClient: pg.Client;

    constructor(connectionInfo:any) {
        this.dbClient = new pg.Client(connectionInfo);
    }
    
    async connect() {
        try {
            await this.dbClient.connect();
            console.log("database connected!");

            this.dbClient.on('error', err => {
                console.error('database error!', err.stack);
            });

            return true;
        } catch (error) {
            console.log((<Error>error).stack);
            return false;
        }
    }
    
    async insertFighter(values:(string|number)[]) {
        try {
            const res = await this.dbClient.query(insertFighter, values);
            return res;
        }
        catch (err) {
            console.log((<Error>err).stack);
        }
    }

    async selectFighter(values:string[]) {
        try {
            const res = await this.dbClient.query(selectFighter, values);
            return res;
        }
        catch (err) {
            console.log((<Error>err).stack);
        }
    }
    
    async insertFight(values:string[]) {
        try {
            const res = await this.dbClient.query(insertFight, values);
            return res;
        }
        catch (err) {
            console.log((<Error>err).stack);
        }
    }
    
    async updateFighter(values:(number|string)[]) {
        try {
            const res = await this.dbClient.query(updateFighter, values);
            return res;
        }
        catch (err) {
            console.log((<Error>err).stack);
        }
    }
}