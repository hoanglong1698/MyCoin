import * as CryptoJS from 'crypto-js';
import * as ecdsa from 'elliptic';
import * as _ from 'lodash'

const ec = new ecdsa.ec('secp256k1');

const COINBASE_AMOUNT: number = 50;

class UnspentTxOut {
    public readonly txOutId: string;
    public readonly txOutIndex: number;
    public readonly address: string;
    public readonly amount: number;

    constructor(txOutId: string, txOutIndex: number, address: string, amount: number) {
        this.txOutId = txOutId;
        this.txOutIndex = txOutIndex;
        this.address = address;
        this.amount = amount;
    }
}

class TxIn {
    public txOutId: string;
    public txOutIndex: number;
    public signature: string;
}

class TxOut {
    public address: string;
    public amount: number;

    constructor(address: string, amount: number) {
        this.address = address;
        this.amount = amount;
    }
}

class Transaction {

    public id: string;

    public txIns: TxIn[];
    public txOuts: TxOut[];
}

