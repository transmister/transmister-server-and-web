import socket from '../socket/socket'
const NodeRSA = require('node-rsa')

const key = new NodeRSA({ b: 1024 })

socket.emit('b', key.exportKey('pkcs1-public-pem'))

// const keyPairToServer = [
//     key.exportKey('pkcs1-public-pem'),
//     key.exportKey('pkcs1-private-pem')
// ]

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
    console.log(keyPair)
})

export default keyPair
export { key, keyPair }
