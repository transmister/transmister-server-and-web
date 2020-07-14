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

    const key = new NodeRSA()
    key.importKey(keyPair.server.public, 'pkcs1-public-pem')
    socket.emit('e', key.encrypt('hello!!!'))

    socket.on('e', (data) => {
        const key = new NodeRSA()
        key.importKey(keyPair.client.private, 'pkcs1-private-pem')
        data = key.decrypt(data)
        console.log(data)
    })
})


export default keyPair
export { key, keyPair }
