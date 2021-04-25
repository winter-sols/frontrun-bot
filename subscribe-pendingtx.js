//var Web3 = require('web3');
//global.web3 = new Web3("ws://127.0.0.1:8546");
var add = 'wss://bsc-ws-node.nariox.org:443'
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.WebsocketProvider(add));
const subscription = web3.eth.subscribe('pendingTransactions', (err, res) => {
if (err) console.error(err);
});
subscription.on('data', (txHash) => {
setTimeout(async () => {
try {
let tx = await web3.eth.getTransaction(txHash);
if (tx) {
console.log('TX hash: ',txHash ); // transaction hash
console.log('TX confirmation: ',tx.transactionIndex ); // "null" when transaction is pending
console.log('TX nonce: ',tx.nonce ); // number of transactions made by the sender prior to this one
console.log('TX block hash: ',tx.blockHash ); // hash of the block where this transaction was in. "null" when transaction is pending
console.log('TX block number: ',tx.blockNumber ); // number of the block where this transaction was in. "null" when transaction is pending
console.log('TX sender address: ',tx.from ); // address of the sender
console.log('TX amount(in Ether): ',web3.utils.fromWei(tx.value, 'ether')); // value transferred in ether
console.log('TX date: ',new Date()); // transaction date
console.log('TX gas price: ',tx.gasPrice ); // gas price provided by the sender in wei
console.log('TX gas: ',tx.gas ); // gas provided by the sender.
console.log('TX input: ',tx.input ); // the data sent along with the transaction.
console.log('=====================================') // a visual separator
}
} catch (err) {
console.error(err);
}
})
});
