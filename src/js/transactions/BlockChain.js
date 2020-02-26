"use strict";

class BlockChain {
}

BlockChain.FEE_POW_MAX = 6;
BlockChain.FEE_SCALE = 8;
BlockChain.FEE_RATE = BlockChain.FEE_SCALE;
BlockChain.FEE_POW_BASE = 1.5;
BlockChain.FEE_PER_BYTE = 64;
BlockChain.MAX_BLOCK_BYTES = 2 << 21;
BlockChain.MAX_REC_DATA_BYTES = BlockChain.MAX_BLOCK_BYTES >> 1;

exports.BlockChain = BlockChain;