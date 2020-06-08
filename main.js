const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Your private key goes here
const myKey = ec.keyFromPrivate('e260ccce84aaa2e6d771f5cf693038729e29e34f932185dc2c3dc7515c9a458f');

// From that we can calculate your public key (which doubles as your wallet address)
const myWalletAddress = myKey.getPublic('hex');

// Create new instance of Blockchain class
const myCoins = new Blockchain();

// Create a transaction & sign it with your key
const tx1 = new Transaction(myWalletAddress, 'address2', 100);
tx1.signTransaction(myKey);
myCoins.addTransaction(tx1);

// Mine block
myCoins.minePendingTransactions(myWalletAddress);

// Create second transaction
const tx2 = new Transaction(myWalletAddress, 'address1', 50);
tx2.signTransaction(myKey);
myCoins.addTransaction(tx2);

// Mine block
myCoins.minePendingTransactions(myWalletAddress);

console.log();
console.log(`Balance of xavier is ${myCoins.getBalanceOfAddress(myWalletAddress)}`);

// Uncomment this line if you want to test tampering with the chain
// savjeeCoin.chain[1].transactions[0].amount = 10;

// Check if the chain is valid
console.log();
console.log('Blockchain valid?', myCoins.isChainValid() ? 'Yes' : 'No');
