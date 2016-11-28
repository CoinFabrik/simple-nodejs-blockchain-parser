# simple-nodejs-blockchain-parser
Parse Bitcoin's raw blockchain data with NodeJS and Bitcore.

**The repository is abandoned, with segwit incoming there are challenges to read the data raw from the data files and is not recommended anyway. Check out the excellent https://bitcore.io/ project by BitPay.**

# How to run it

- Set the variable "bitcoinDataDir" at the top of [blockchain-parser.js](https://github.com/CoinFabrik/simple-nodejs-blockchain-parser/blob/master/blockchain-parser.js) to your bitcoin [data directory](https://en.bitcoin.it/wiki/Data_directory) path.
- Update the for loop at the bottom to include all the blk\*.dat files on your **\<bitcoin directory\>/blocks** folder (Simply update the upper bound).

Then run:

**npm install**

**npm start**
