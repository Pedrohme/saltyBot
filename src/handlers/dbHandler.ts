import _got from "got";

const user = process.env.API_USER;
const pass = process.env.API_PASS;

export default class dbHandler {
    token:string;
    got:typeof _got;

    constructor () {
        this.got = _got.extend({
            prefixUrl: process.env.API_URL,
            responseType: 'json',
        });
        this.token = "";
        this.authenticate();
    }
    
    private async authenticate() {
        try {
            const res = await this.got.post(`api/login`,  {
                json: {
                    user: user,
                    password: pass,
                },
            });
            console.log("Authentication status code: ", res.statusCode);
            console.log(res.body);
            try {
                if ((res.body as any).auth) {
                    this.token = (res.body as any).token;
                    return true;
                }
            }
            catch (err) {
                if (err instanceof Error) console.log(err.stack);
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
            const res = await this.got.post(`api/fighter`,  {
                json: {
                    name: values[0],
                    wins: 0,
                    losses: 0
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

    async selectFighter(values:string[]) {
        try {
            const res = await this.got.get(`api/fighter/${encodeURIComponent(values[0])}`);
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
            const res = await this.got.post(`api/fights`,  {
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
            const res = await this.got.put(`api/fighter`,  {
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

    async updateIndexPage(fightera:string, fighterb:string) {
        console.log("chegouaqui");
        try {
            const res = await this.got.post('',  {
                json: {
                    fightera: fightera,
                    fighterb: fighterb,
                },
                headers: {
                    "x-access-token" : this.token
                }
            });
            console.log(res.body);
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




