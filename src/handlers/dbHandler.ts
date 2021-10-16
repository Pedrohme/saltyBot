import got from "got";

export async function insertFighter(values:(string|number)[]) {
    try {
        const res = await got.post("http://localhost:3000/api/fighter",  {
            json: {
                name: values[0],
                wins: 0,
                losses: 0
            },
            responseType: 'json'
        });
        console.log("inser fighter status code: ", res.statusCode);
        return res;
    } catch (err) {
        console.log((<Error>err).stack);
        return null;
    }
}

export async function selectFighter(values:string[]) {
    try {
        const res = await got.get(`http://localhost:3000/api/fighter/${values[0]}`, {
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
        const res = await got.post("http://localhost:3000/api/fights",  {
            json: {
                fightera: values[0],
                fighterb: values[1],
                winner: values[2]
            },
            responseType: 'json'
        });
        console.log("insert fight status code: ", res.statusCode);
        return res;
    } catch (err) {
        console.log((<Error>err).stack);
        return null;
    }
}

export async function updateFighter(values:(number|string)[]) {
    try {
        const res = await got.put("http://localhost:3000/api/fighter",  {
            json: {
                wins: values[0],
                losses: values[1],
                name: values[2]
            },
            responseType: 'json'
        });
        console.log("update fighter status code: ", res.statusCode);
        return res;
    } catch (err) {
        console.log((<Error>err).stack);
        return null;
    }
}