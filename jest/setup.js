
jest.mock('../src/core/request/BaseRequest', () => {
    return {
        baseRequest: ({ url }) => {
            return new Promise((resolve) => {
                const r = {
                    error: null,
                    respInfo: {
                        status: 200,
                    },
                    data: {},
                };
                if (url.indexOf('height') !== -1) {
                    resolve('2');
                } else {
                    resolve(r);
                }
            });
        },
    };
});