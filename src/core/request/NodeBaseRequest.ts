import {ResponseError} from "./ResponseError";

const fetch = require("node-fetch");

export class NodeBaseRequest {

    constructor(protected baseUrl: string = "") {
    }

    fetch(url: string, method: Methods = "GET", body?: any, headers?: { [key: string]: string }): Promise<any> {
        const fullUrl = `${this.baseUrl}/${url}`;
        return fetch(fullUrl, { method, headers, body })
            .then((r: any) => {
                if (r.status < 200 || r.status >= 300) {
                    throw new Error(r.status.toString());
                }
                return r;
            })
            .catch((e: any) => {
                //Log.error(e);
                throw new Error(e);
            });
    }

    fetchJSON(url: string, method: Methods = "GET", body?: any, headers?: { [key: string]: string }): Promise<any> {
        return this
            .fetch(url, method, body, headers)
            .then(r => {
                const data = r.json();
                //console.log(fullUrl,data);
                if (data.error) {
                    throw new ResponseError(data);
                }
                return data;
            })
            .catch(e => {
                throw new Error(e);
            });
    }
}

type Methods = "POST" | "GET" | "DELETE" | "PUT" | "post" | "get" | "delete" | "put";
