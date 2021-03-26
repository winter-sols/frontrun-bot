const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const input = require('./input');
const web3Rpc = new Web3('http://127.0.0.1:8545/rpc');
const web3 = new Web3('ws://127.0.0.1:8546');

let {addressFrom, addressTo, privateKey, startGasPrice, maxGasPrice, gasLimit, startDate, increment, value} = input;

startGasPrice = parseInt(startGasPrice) * 1e9;
maxGasPrice = parseInt(maxGasPrice) * 1e9;
privateKey = new Buffer(privateKey, 'hex');
addressTo = addressTo.toLowerCase();
addressFrom = addressFrom.toLowerCase();
increment = parseInt(increment) * 1e9;

let year = parseInt(startDate.year);
let month = parseInt(startDate.month) - 1;
let date = parseInt(startDate.date);
let hour = parseInt(startDate.hour);
let minute = parseInt(startDate.minute);
let second = parseInt(startDate.second);

let currentGasPrice = startGasPrice;
let recieved = false;

startDate = new Date(year, month, date, hour, minute, second);


web3Rpc.extend({
    methods: [
        {
            name: 'getQueue',
            call: 'parity_pendingTransactions',
        }
    ]
});


const CronJob = require('cron').CronJob;
const job = new CronJob(startDate, () => {
        console.log(new Date());
        web3Rpc.getQueue().then(data => {
            data = data.filter(i => i.to && i.to.toLowerCase() === addressTo);
            let max = parseInt(Math.max.apply(Math, data.map(function (o) {
                return o.gasPrice;
            })));

            if (currentGasPrice <= max && max < maxGasPrice) {
                currentGasPrice = max + increment;
                console.log(`take max gas price from tx pool ${currentGasPrice / 1e9} gwei`)
            }

            let opt = {
                gasPrice: currentGasPrice,
                privateKey
            };

            sendTransaction(opt, `initial tx with gas price ${currentGasPrice / 1e9} gwei`)
        });

    }, () => {
    }, true
);


web3.eth.getBlockNumber()
    .then(console.log);


web3.eth
    .subscribe('pendingTransactions', async function (error, data) {
        if (error) {
            return console.log(error);
        }


        try {
            let t = await web3.eth.getTransaction(data);
            let now = new Date();
            let txGasPrice = parseInt(t.gasPrice);

            if (t && t.gasPrice && txGasPrice >= currentGasPrice && maxGasPrice > txGasPrice && now.getTime() > startDate.getTime() && !recieved &&
                t.to.toLowerCase() === addressTo && addressFrom !== t.from.toLowerCase()) {

                console.log(`found tx with higher gas price ${t.hash} ${t.gasPrice / 1e9} gwei`);
                currentGasPrice = txGasPrice + increment;
                console.log(`send new tx with gas price ${currentGasPrice / 1e9} gwei`);

                let opt = {
                    gasPrice: currentGasPrice,
                    privateKey
                };
                sendTransaction(opt, `replaced due to ${t.hash}`);
            }

        } catch (e) {
            console.log(e)
        }
    });


async function sendTransaction(opt, status) {

    console.time('exec');
    let {gasPrice, privateKey} = opt;

    let nonce = await web3.eth.getTransactionCount(addressFrom);

    const rawTx = {
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        to: addressTo,
        value: web3.utils.numberToHex(web3.utils.toWei(value, 'ether'))
    };

    const tx = new Tx(rawTx);
    tx.sign(privateKey);

    const serializedTx = tx.serialize();

    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('transactionHash', (hash) => {
            console.log("transactionHash", hash, status);
        })
        .on('receipt', (receipt) => {
            console.log("receipt", receipt.blockNumber, receipt.transactionHash);
            console.timeEnd('exec');

            recieved = true;

        })

        .on('error', (error) => {
            console.log("error", error)
        })
}
