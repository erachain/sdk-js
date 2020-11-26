export enum ChainMode {
    DEFAULT = "DEFAULT",
    SIDE = "SIDE",
    CLONE = "CLONE",
}

export interface IApiConfig {
    mode: ChainMode,
    genesis: string,
}