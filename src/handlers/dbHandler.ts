import got from "got";

const apiBaseUrl = process.env.API_URL;

let token:any;

async function authenticate() {
    try {
        const res = await got.post(`${apiBaseUrl}login`,  {
            json: {
                user: process.env.API_USER,
                password: process.env.API_PASS,
            },
            responseType: 'json',
        });
        console.log("Authentication status code: ", res.statusCode);
        console.log(res.body);
        try {
            if ((<any>res.body).auth) {
                token = (<any>res.body).token;
            }
        }
        catch (err) {
            console.log((<Error>err).stack);    
            token = "";
        }
    } catch (err) {
        console.log((<Error>err).stack);
    }
}

authenticate();

export async function insertFighter(values:(string|number)[]) {
    try {
        const res = await got.post(`${apiBaseUrl}fighter`,  {
            json: {
                name: values[0],
                wins: 0,
                losses: 0
            },
            responseType: 'json',
            headers: {
                "x-access-token" : token
            }
        });
        console.log("insert fighter status code: ", res.statusCode);
        if (res.statusCode === 401 || res.statusCode === 500) {
            await authenticate();
        }
        return res;
    } catch (err) {
        console.log((<Error>err).stack);
        return null;
    }
}

export async function selectFighter(values:string[]) {
    try {
        const res = await got.get(`${apiBaseUrl}fighter/${values[0]}`, {
            responseType: 'json'
        });
        console.log("select fighter status code: ", res.statusCode);
        console.log(res.body);
        return res;
    } catch (err) {
        console.log((<Error>err).stack);
        return null;
    }
}

export async function insertFight(values:string[]) {
    try {
        const res = await got.post(`${apiBaseUrl}fights`,  {
            json: {
                fightera: values[0],
                fighterb: values[1],
                winner: values[2]
            },
            responseType: 'json',
            headers: {
                "x-access-token" : token
            }
        });
        console.log("insert fight status code: ", res.statusCode);
        if (res.statusCode === 401 || res.statusCode === 500) {
            await authenticate();
        }
        return res;
    } catch (err) {
        console.log((<Error>err).stack);
        return null;
    }
}

export async function updateFighter(values:(number|string)[]) {
    try {
        const res = await got.put(`${apiBaseUrl}fighter`,  {
            json: {
                wins: values[0],
                losses: values[1],
                name: values[2]
            },
            responseType: 'json',
            headers: {
                "x-access-token" : token
            }
        });
        console.log("update fighter status code: ", res.statusCode);
        if (res.statusCode === 401 || res.statusCode === 500) {
            await authenticate();
        }
        return res;
    } catch (err) {
        console.log((<Error>err).stack);
        return null;
    }
}