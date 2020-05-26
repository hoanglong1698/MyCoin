import * as CryptoJS from 'crypto-js';
import { broadcastLatest } from './p2p';

//cấu trúc 1 block
class Block {

    public index: number;
    public hash: string;
    public previousHash: string;
    public timestamp: number;
    public data: string;

    constructor(index: number, hash: string, previousHash: string, timestamp: number, data: string) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
    }
}

//Block đầu tiên (set giá trị tĩnh)
const genesisBlock: Block = new Block(
    0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', null, 1465154705, 'my genesis block!!'
);

let blockchain: Block[] = [genesisBlock]; //Tạm thời dùng mảng tĩnh để lưu các block

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];//Hàm lấy block mới nhất

const getBlockchain = (): Block[] => blockchain; //Hàm lấy danh sách block hiện tại

//Hàm tính giá trị băm (hash) của 1 block, sử dụng hàm băm SHA-256
const calculateHash = (index: number, previousHash: string, timestamp: number, data: string): string =>
    CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

//Hàm phát sinh block tiếp theo
const generateNextBlock = (blockData: string) => {
    const previousBlock: Block = getLatestBlock();
    const nextIndex: number = previousBlock.index + 1;
    const nextTimestamp: number = new Date().getTime() / 1000;
    const nextHash: string = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    const newBlock: Block = new Block(nextIndex, nextHash, previousBlock.hash, nextTimestamp, blockData);
    addBlock(newBlock);
    broadcastLatest();
    return newBlock;
};

const addBlock = (newBlock: Block) => {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
    }
};

//Hàm kiểm tra block mới có đúng hay không
const isValidNewBlock = (newBlock: Block, previousBlock: Block) => {
    if (previousBlock.index + 1 !== newBlock.index) { //số thứ tự block
        console.log('invalid index');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) { //hash của block trước khác previous hash của block mới tạo
        console.log('invalid previoushash');
        return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) { //hash của block mới phải đúng
        console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
        console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }
    return true;
};

//Hàm tính hash của 1 block bất kì
const calculateHashForBlock = (block: Block): string =>
    calculateHash(block.index, block.previousHash, block.timestamp, block.data);

//Hàm kiểm tra các thuộc tính của 1 block có đúng kiểu dữ liệu hay chưa để tránh hư hỏng toàn bộ block.
const isValidBlockStructure = (block: Block): boolean => {
    return typeof block.index === 'number'
        && typeof block.hash === 'string'
        && typeof block.previousHash === 'string'
        && typeof block.timestamp === 'number'
        && typeof block.data === 'string';
};

//Hàm kiểm tra toàn bộ block có đúng hay chưa
const isValidChain = (blockchainToValidate: Block[]): boolean => {
    const isValidGenesis = (block: Block): boolean => { //xác thực block đầu tiên
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };

    if (!isValidGenesis(blockchainToValidate[0])) {
        return false;
    }

    for (let i = 1; i < blockchainToValidate.length; i++) { //xác thực toàn bộ các block còn lại
        if (!isValidNewBlock(blockchainToValidate[i], blockchainToValidate[i - 1])) {
            return false;
        }
    }
    return true;
};

//Hàm xử lý khi có 2 node cùng generate ra 1 block (lấy chain dài hơn để nối vào)
const replaceChain = (newBlocks: Block[]) => {
    if (isValidChain(newBlocks) && newBlocks.length > getBlockchain().length) {
        console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
        blockchain = newBlocks;
        broadcastLatest();
    } else {
        console.log('Received blockchain invalid');
    }
};

const addBlockToChain = (newBlock: Block) => {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
        return true;
    }
    return false;
};



export {Block, getBlockchain, getLatestBlock, generateNextBlock, isValidBlockStructure, replaceChain, addBlockToChain};