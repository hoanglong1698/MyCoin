import * as CryptoJS from 'crypto-js';

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

