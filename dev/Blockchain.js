const sha256 = require('sha256')
const currentNodeUrl = process.argv[3]

class Blockchain {

    constructor() {
        this.chain = []
        this.pendingTransactions = []
        this.currentNodeUrl = currentNodeUrl
        this.networkNodes = []
        this.createNewBlock(100, '0', '0')
        
    }

    createNewBlock(nonce, previousBlockHash, hash) {
        const newBlock = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            nonce: nonce,
            hash: hash,
            previousBlockHash: previousBlockHash,

        }

        this.pendingTransactions = []
        this.chain.push(newBlock)

        return newBlock
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1]
    }

    createNewTransaction(amount, sender, recipient) {
        const newTransaction = {
            amount: amount,
            sender: sender,
            recipient: recipient,
        }
        this.pendingTransactions.push(newTransaction)
        return this.getLastBlock()['index'] + 1
    }

    hashBlock(prevBlockHash, currentBlockData, nonce) {
        const dataAsString = prevBlockHash + nonce.toString() + JSON.stringify(currentBlockData)
        const hash = sha256(dataAsString)
        return hash
    }

    proofOfWork(prevBlockHash, currentBlockData) {
        let nonce = 0

        let hash = this.hashBlock(prevBlockHash, currentBlockData, nonce)
        while(hash.substring(0,4) !== '0000') {
            hash = this.hashBlock(prevBlockHash, currentBlockData, ++nonce)
        }
       
        return nonce
    }

}



module.exports = Blockchain