## Concept: 

We want to implement the design described in this research paper: https://arxiv.org/abs/2009.14021

## Data Pipeline:

1. Data collection: we will setup geth full nodes (a client for BSC) that collect pending transactions from the BSC network. If we want to maximize our chances, we have to be the first one to spot the victim’s transaction.
2. Data processing: A script will iterate through all the pending transactions and look for those that interact with the Pancakeswap. It will parse the transaction data and use the information there (target token, amount transferred, transaction fee, max slippage, etc.) to analyze if it’s profitable to initiate the attack. 
3. The attack: Send two txns that sandwich the victim's txn
