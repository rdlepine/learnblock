const express = require('express')
const bodyParser = require('body-parser')
const Blockchain = require('./dev/Blockchain')
const uuid = require('uuid/v1')
const nodeAddress = uuid().split('-').join('')

const port = process.argv[2]

console.log(nodeAddress)

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const bitcoin = new Blockchain()

app.get('/blockchain', (req,res) => {
    res.send(bitcoin)
})

app.post('/transaction', (req, res) => {
    const {amount, sender, recipient} = req.body
    const blockIndex = bitcoin.createNewTransaction(amount, sender, recipient)
    res.send({note: `Transaction will be added in block ${blockIndex}`})
})

app.get('/mine', (req, res) => {
   
    const lastBlock = bitcoin.getLastBlock()
    const prevHash = lastBlock.hash
   
    const currentBlockData = {
        transaction: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    }

    const nonce = bitcoin.proofOfWork(prevHash, currentBlockData)
    const blockHash = bitcoin.hashBlock(prevHash, currentBlockData, nonce)

    bitcoin.createNewTransaction(12.5, "00", nodeAddress)
    const newBlock = bitcoin.createNewBlock(nonce, prevHash, blockHash)

    res.send({'mined': 'new block mined successfule', block: newBlock})
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})  