import socket from '../socket/socket'

var encryptedSocket = {
    emit: undefined,
    on: undefined
}

var keysToClients = {}

function initializeEncryptionToServer() {
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

        encryptedSocket.emit = (event, data) => {
            socket.emit(event, new NodeRSA()
                .importKey(keyPair.server.public, 'pkcs1-public-pem')
                .encrypt(JSON.stringify(data), 'base64')
            )
        }

        encryptedSocket.on = (event, listener) => {
            socket.on(event, (data) => {
                listener(
                    JSON.parse(
                        new NodeRSA()
                            .importKey(keyPair.client.private, 'pkcs1-private-pem')
                            .decrypt(data, 'utf8')
                    )
                )
            })
        }

        if (process.env.NODE_ENV != 'production') {
            encryptedSocket.emit('e', {
                event: 'test',
                testMsg: `${socket.id} is testing, time: ${new Date().getFullYear()}-${(new Date().getMonth() + 1)}-${new Date().getDate()} - ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
            })

        }

        encryptedSocket.on('e', (data) => {
            switch (data.event) {
                case 'msg>specific.b':
                    keysToClients[data.data.username] = {
                        destination: {
                            public: data.data.publicKey
                        },
                        local: {
                            // public: key.exportKey('pkcs1-public-pem'),
                            // private: key.exportKey('pkcs1-private-pem')
                        }
                    }
                    break;

                default:
                    break;
            }
        })
    })
}


export default encryptedSocket
export { encryptedSocket, initializeEncryptionToServer, keysToClients }
