# frontrun-bot
Frontrun Bot for Uniswap &amp; Pancakeswap


**BUIDL with nodejs**

Telegram: @casanva



# Active bot for sale, check screenshot, if you dont know what is frontrun bot, don't ask

# ToDo

- [x] Run own node
- [x] Sync node
- [x] Process tx's

# PHASE 1 - Get latest block and tx's

Running Geth on RPi4.

Light node sync downloaded blocks but didn't allow access to the TxPool. Rerunning and synchronising now in fast mode.

https://docs.binance.org/smart-chain/developer/fullnode.html
https://docs.binance.org/smart-chain/developer/rpc.html


Process transactions to get:

- 'from' and 'to' addresses --> to match transactions with the same routing.
- gas price --> to sort matching calls and determine if this a front-run
- input data / output script --> detect identical calls.
- time --> find earliest

## Exchanges

- info: https://money-legos.studydefi.com/#/quickstart

1inch (todo)

PancakeSwap

Binance
Multi-Chain (Lend)

bZx (todo)

Compound (todo)
address constant CompoundComptrollerAddress =
0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B;
address constant CEtherAddress = 0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5;

UniSwap

dydx (todo)

# PHASE 2 - Analyse mempool for un-mined transactions

Guide: https://www.quiknode.io/guides/defi/how-to-access-ethereum-mempool

Pricing for node: https://www.quiknode.io/?utm_source=internal&utm_campaign=guides/

# PHASE 3 - Send tokens to addresses identified




# SETUP
Install latest Node.js
At the root of the project folder
 ```
$ npm install web3
$ npm install axios
$ npm install colors
$ npm install ethereumjs-tx
$ npm install abi-decoder
 ```
Usage
Enter your PRIVATE_KEY before running the program.
 ```
$ node frontrun.js
 ```
