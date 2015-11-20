var fs = require('fs'),
  bitcore = require('bitcore-lib'),
  bitcoinDataDir = '<path to my bitcoin directory>';

function readVarInt(stream) {
  var size = stream.read(1);
  var sizeInt = size.readUInt8();
  if (sizeInt < 253) {
    return size;
  }
  var add;
  if (sizeInt == 253) add = 2;
  if (sizeInt == 254) add = 4;
  if (sizeInt == 255) add = 8;
  if (add) {
    return Buffer.concat([size, stream.read(add)], 1 + add);
  }
  return -1;
}

function toInt(varInt) {
  if (!varInt) {
    return -1;
  }
  if (varInt[0] < 253) return varInt.readUInt8();
  switch(varInt[0]) {
    case 253: return varInt.readUIntLE(1, 2);
    case 254: return varInt.readUIntLE(1, 4);
    case 255: return varInt.readUIntLE(1, 8);
  }
}


function getRawTx(reader) {
  var txParts = [];
  txParts.push(reader.read(4)); //Version

  //Inputs
  var inputCount = readVarInt(reader);
  txParts.push(inputCount);
  for(var i = toInt(inputCount) - 1; i >= 0; i--) {
    txParts.push(reader.read(32)); //Previous tx
    txParts.push(reader.read(4)); //Index
    var scriptLength = readVarInt(reader);
    txParts.push(scriptLength);
    txParts.push(reader.read(toInt(scriptLength))); //Script Sig
    txParts.push(reader.read(4)); //Sequence Number
  }

  //Outputs
  var outputCount = readVarInt(reader);
  txParts.push(outputCount);
  for(i = toInt(outputCount) - 1; i >= 0; i--) {
    txParts.push(reader.read(8)); //Value
    var scriptLen = readVarInt(reader);
    txParts.push(scriptLen);
    txParts.push(reader.read(toInt(scriptLen))); //ScriptPubKey
  }
  txParts.push(reader.read(4)); //Lock time

  return Buffer.concat(txParts);
}

function bufferReader(buffer) {
  var index = 0;
  return {
    read: function read(bytes) {
      if (index + bytes > buffer.length) {
        return null;
      }
      var result = buffer.slice(index, index + bytes);
      index += bytes;
      return result;
    }
  }
}

for(var i = 0; i < 382; i++) {
  var fileNumber = ('0000' + i).slice(-5),
    data = fs.readFileSync(bitcoinDataDir + '/blocks/blk' + fileNumber + '.dat'),
    reader = bufferReader(data),
    blockHeader = reader.read(88);
  while(blockHeader !== null) {
    var txCount = toInt(readVarInt(reader));
    console.log('\n---- New block with ' + txCount + ' transactions ----\n');
    for(var j = 0; j < txCount; j++) {
      var rawTx = getRawTx(reader);
      var parsedTx = new bitcore.Transaction(rawTx);
      console.dir(parsedTx.toObject());
    }
    blockHeader = reader.read(88);
  }
}
