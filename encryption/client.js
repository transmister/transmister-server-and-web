import socket from '../socket/socket'
const NodeRSA = require('node-rsa')

const key = new NodeRSA({ b: 1024 })

socket.emit('b', key.exportKey('pkcs1-public-pem'))

var keyPair = {
    client: {
        public: key.exportKey('pkcs1-public-pem'),
        private: key.exportKey('pkcs1-private-pem')
    },
    server: {
        public: undefined
    }
}

socket.on('b', (data) => {
    keyPair.server.public = data

    socket.emit('e', new NodeRSA().importKey(keyPair.server.public, 'pkcs1-public-pem').encrypt(JSON.stringify({
        event: 'test',
        testMsg: `${socket.id} is testing`
    }), 'base64'))

    socket.on('e', (data) => {
        data = new NodeRSA().importKey(keyPair.client.private, 'pkcs1-private-pem').decrypt(data, 'utf8')
        data = JSON.parse(data)

        console.log(`received message: ${data}`)
    })
})


export default keyPair
export { key, keyPair }
