import { Bytes } from '../../Bytes';
import { DataWriter } from '../../DataWriter';
import { Base58 } from '../../../../crypt/libs/Base58';

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
export interface IDocuments {
  MS: string;
  MSU: boolean;
  TM: number;
  TMU: boolean;
  PR: IMetadata;
  HS: IMetadata;
  HSU: boolean;
  FU: boolean;
  F: IFiles;
}

export class Documents {

  static JSON_LENGTH = 4;

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

  json(): IDocuments  {
    return {
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
  }

  async jsonToBytes(): Promise<Int8Array> {
    const jsonString = JSON.stringify(this.json());
    return await Bytes.stringToByteArray(jsonString);
  }

  async toBytes(): Promise<Int8Array> {
    const data = new DataWriter();

    const jsonBytes = await this.jsonToBytes();
    await this.lengthToBytes(jsonBytes.length, data);
    data.set(jsonBytes);

    this.files.forEach(bytes => data.set(bytes));

    return data.data;
  }

  async lengthToBytes(length: number, dataWriter: DataWriter): Promise<void> {
    const bytes = await Bytes.intToByteArray(length);
    // console.log("lengthToBytes", { length, bytes });
    dataWriter.set(bytes);
  }

  static async parse(raw: string): Promise<Documents> {
    const data = await Base58.decode(raw);

    // READ LENGTH OF JSON
    const lengthBytes = data.slice(0, Documents.JSON_LENGTH);
    const length = await Bytes.intFromByteArray(lengthBytes);

    // console.log("Documents.parse.length", length);

    let position = Documents.JSON_LENGTH;

    // READ JSON
    const jsonBytes = data.slice(position, position + length);
    const stringJson = await Bytes.stringFromByteArray(jsonBytes);
    // console.log("Documents.parse.json", stringJson);
    const json = JSON.parse(stringJson);

    position += length;

    const { MS, MSU, TM, TMU, PR, HSU, FU } = json;
    const documents = new Documents(MS, MSU, TM, TMU, PR, HSU, FU);
    documents.hs = { ...json.HS };
    documents.f = { ...json.F };
  
    Object.values(json.F).forEach((meta: any) => {
      // READ FILE
      const bytes = data.slice(position, position + meta.SZ);
      documents.files.push(bytes);
      position += meta.SZ;
      // console.log("Documents.parse.file", meta);
    });

    return documents;
  }

}
