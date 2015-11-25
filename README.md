# simple-nodejs-blockchain-parser
Parse Bitcoin's raw blockchain data with NodeJS and Bitcore.

# How to run it

Set the variable "bitcoinDataDir" at the top of [blockchain-parser.js](https://github.com/CoinFabrik/simple-nodejs-blockchain-parser/blob/master/blockchain-parser.js) to your bitcoin [data directory](https://en.bitcoin.it/wiki/Data_directory) path.
You might also want to update the for loop at the bottom to include all the blk\*.dat files on the **\<bitcoin directory\>/blocks** folder.

Then run:

**npm install**

**npm start**
