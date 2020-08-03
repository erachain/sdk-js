// import * as base58 from "bs58";
import { Bytes } from '../../Bytes';
import { DataWriter } from '../../DataWriter';

export interface IMetadata {
  [key: string]: string;
}

export interface IFiles {
  [key: string]: IMetaFile;
}

export interface IMetaFile {
  FN: string; // имя файла
  ZP: boolean; // архив
  SZ: number; // размер в байтах в данных
}

export class Documents {
  ms: string;
  msu: boolean;
  tm: number;
  tmu: boolean;
  pr: IMetadata;
  hs: IMetadata;
  hsu: boolean;
  fu: boolean;
  f: IFiles;
  files: Int8Array[];

  constructor(ms: string, msu: boolean, tm: number, tmu: boolean, pr: IMetadata, hsu: boolean, fu: boolean) {
    this.ms = ms;
    this.msu = msu;
    this.tm = tm;
    this.tmu = tmu;
    this.pr = pr;
    this.hsu = hsu;
    this.fu = fu;
    this.hs = {};
    this.f = {};
    this.files = [];
  }

  addFile(name: string, compressed: boolean, data: Int8Array) {
    const size = Object.values(this.f).length;
    const key = size.toString();

    const meta = {
      FN: name,
      ZP: compressed,
      SZ: data.length,
    };
    this.f[key] = meta;

    this.files.push(data);

  }

  addHash(path: string, hash: string) {
    this.hs[hash] = path;
  }

  async getJson(): Promise<Int8Array> {
    const json = {
      MS: this.ms,
      MSU: this.msu,
      TM: this.tm,
      TMU: this.tmu,
      PR: { ...this.pr },
      HS: { ...this.hs },
      HSU: this.hsu,
      F: { ...this.f },
      FU: this.fu,
    };

    console.log('getJson', json);
    const jsonString = JSON.stringify(json);
    return await Bytes.stringToByteArray(jsonString);
  }

  async toBytes(): Promise<Int8Array> {
    const data = new DataWriter();

    const jsonBytes = await this.getJson();
    await this.lengthToBytes(jsonBytes.length, data);
    data.set(jsonBytes);

    this.files.forEach(bytes => data.set(bytes));

    return data.data;
  }

  async lengthToBytes(length: number, dataWriter: DataWriter): Promise<void> {
    const bytes = await Bytes.intToByteArray(length);
    console.log("lengthToBytes", { length, bytes });
    dataWriter.set(bytes);
  }
}
