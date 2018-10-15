const express = require('express')
const bodyParser = require('body-parser')
const Blockchain = require('./dev/Blockchain')
const uuid = require('uuid/v1')
const nodeAddress = uuid().split('-').join('')
const rp = require('request-promise')

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

// register a node an broadcast to network
app.post('/register-and-broadcast-node', (req, res) => {
    const {newNodeUrl}  = req.body

    if(bitcoin.networkNodes.indexOf(newNodeUrl) === -1 ) {
        bitcoin.networkNodes.push[newNodeUrl]
    }

    const regNodesPromises = []

    bitcoin.networkNodes.forEach( (node) => {
      //register nodes  
      const requestOptions = {
          uri: networkNodeUrl + '/register-node',
          method: 'POST',
          body: {newNodeUrl: newNodeUrl},
          json: true,
      }
      regNodesPromises.push(rp(requestOptions))
    }) 

    Promise.all(regNodesPromises)
           .then( (data) => {
                const bulkRegisterOptions = {
                    uri: newNodeUrl + '/register-nodes-bulk',
                    method: 'POST',
                    body: {allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]},
                    json: true,
                }

                return rp(bulkRegisterOptions)
           }).then( (data) => {
               res.json({note: 'New node registered successfully'})
           })

})

// register node with network
app.post('/register-node', (req, res) => {
    const {newNodeUrl} = req.body
    console.log(newNodeUrl)
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) === -1
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl
    if(nodeNotAlreadyPresent && notCurrentNode) {
        bitcoin.networkNodes.push(newNodeUrl)
    }
    res.json({node: 'New node registered successfully'})
})

app.post('/register-nodes-bulk', (req, res) => {
    const {allNetworkNodes} = req.body

    console.log(allNetworkNodes)
    allNetworkNodes.forEach( (node) => {
    
        const nodeAlreadyPresent = bitcoin.networkNodes.indexOf(node) === -1
        const notCurrentNode = bitcoin.currentNodeUrl !== node
        if(nodeAlreadyPresent) {
           // console.log(node)
            bitcoin.networkNodes.push(node)
        }
    })

    res.json({note: 'Bulk Registration Successfull'})

}) 

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})  