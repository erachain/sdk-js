import { IEraBlock } from '../types/era/IEraBlock';
import { NodeBaseRequest } from './NodeBaseRequest';

export class BlocksRequest extends NodeBaseRequest {
  constructor(baseUrl = '') {
    super(baseUrl);
  }

  blocksFromHeight(height: number, limit: number): Promise<{ blocks: IEraBlock[] }> {
    return this.fetchJSON(`blocksfromheight/${height}/${limit}`);
  }

  blocksSignaturesFromHeight(height: number, limit: number): Promise<{ blocks: IEraBlock[] }> {
    return this.fetchJSON(`blockssignaturesfromheight/${height}/${limit}`);
  }
}
