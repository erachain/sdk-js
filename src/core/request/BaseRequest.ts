const fetch = require("node-fetch");

export class BaseRequest {

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
                throw new Error(e);
                // stores.nodesStore.nextNode();
            });
    }

    fetchJSON(url: string, method: Methods = "GET", body?: any, headers?: { [key: string]: string }): Promise<any> {
        return this
            .fetch(url, method, body, headers)
            .then(r => {
                const data = r.json();
                if (data.error) {
                    // stores.nodesStore.nextNode();
                    throw new Error(data.error);
                }
                return data;
            });
    }
}

type Methods = "POST" | "GET" | "DELETE" | "PUT" | "post" | "get" | "delete" | "put";
