const Blockchain = require('./Blockchain')

const bitcoin = new Blockchain()

console.log(bitcoin)

bitcoin.createNewBlock(2389, 'AAIOND888', 'A907383HDHDH')
//bitcoin.createNewBlock(111, 'IAAOND888', 'B907383HDHDH')
//bitcoin.createNewBlock(2489, 'IAAND888', 'C907383HDHDH')


bitcoin.createNewTransaction(199, 'me2','you2')

bitcoin.createNewTransaction(199, 'me1','you1')
bitcoin.createNewTransaction(199, 'me3','you3')

bitcoin.createNewBlock(111, 'IAAOND888', 'B907383HDHDH')



const previousBlockHash = 'UDUDUUDUDUUDDUDU'
const currentBlockData = [
    {
        'amount': 10,
        'sender': 'UDDUDUDU',
        'recipeint': 'UDUDUDUD'
    },
    {
        'amount': 120,
        'sender': 'DFDFFDF',
        'recipeint': 'UDUDDDDUDUD'
    },
    {
        'amount': 1220,
        'sender': 'UDUDUDDU',
        'recipeint': 'DDDDD'
    }
]



let nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData)

console.log(nonce)

console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce))
