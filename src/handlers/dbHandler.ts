import _got from "got";

const user = process.env.API_USER;
const pass = process.env.API_PASS;


export default class dbHandler {
    token:any;
    got:typeof _got;

    constructor () {
        this.got = _got.extend({
            prefixUrl: process.env.API_URL,
            responseType: 'json',
        });
        this.authenticate();
    }
    
    private async authenticate() {
        try {
            const res = await this.got.post(`login`,  {
                json: {
                    user: user,
                    password: pass,
                },
            });
            console.log("Authentication status code: ", res.statusCode);
            console.log(res.body);
            try {
                if ((<any>res.body).auth) {
                    this.token = (<any>res.body).token;
                    return true;
                }
            }
            catch (err) {
                console.log((<Error>err).stack);
                this.token = "";
            }
        } catch (err) {
            if (err instanceof _got.RequestError && err.response) {
                console.log("Authentication status code: ", err.response.statusCode);
                console.log(err.response.body);
            }
            else if (err instanceof Error) {
                console.log(err.stack);
            }
        }
        return false;
    }

    async insertFighter(values:(string|number)[]) {
        try {
            const res = await this.got.post(`fighter`,  {
                json: {
                    name: values[0],
                    wins: 0,
                    losses: 0
                },
                headers: {
                    "x-access-token" : this.token
                }
            });
            console.log("insert fighter status code: ", res.statusCode);
            return res;
        } catch (err) {
            if (err instanceof _got.RequestError && err.response) {
                if (err.response.statusCode === 401 || err.response.statusCode === 500) {
                    await this.authenticate();
                }
                return err.response;
            }
            else if (err instanceof Error) {
                console.log(err.stack);
            }
            return null;
        }
    }

    async selectFighter(values:string[]) {
        try {
            const res = await this.got.get(`fighter/${encodeURIComponent(values[0])}`);
            return res;
        } catch (err) {
            if (err instanceof _got.RequestError) {
                if (err.response) {
                    return err.response;
                }
            }
            else if (err instanceof Error) {
                console.log(err.stack);
            }
            return null;
        }
    }

    async insertFight(values:string[]) {
        try {
            const res = await this.got.post(`fights`,  {
                json: {
                    fightera: values[0],
                    fighterb: values[1],
                    winner: values[2]
                },
                headers: {
                    "x-access-token" : this.token
                }
            });
            return res;
        } catch (err) {
            if (err instanceof _got.RequestError && err.response) {
                if (err.response.statusCode === 401 || err.response.statusCode === 500) {
                    await this.authenticate();
                }
                return err.response;
            }
            else if (err instanceof Error) {
                console.log(err.stack);
            }
            return null;
        }
    }

    async updateFighter(values:(number|string)[]) {
        try {
            const res = await this.got.put(`fighter`,  {
                json: {
                    wins: values[0],
                    losses: values[1],
                    name: values[2]
                },
                headers: {
                    "x-access-token" : this.token
                }
            });
            return res;
        } catch (err) {
            if (err instanceof _got.RequestError && err.response) {
                if (err.response.statusCode === 401 || err.response.statusCode === 500) {
                    await this.authenticate();
                }
                return err.response;
            }
            else if (err instanceof Error) {
                console.log(err.stack);
            }
            return null;
        }
    }
}




