import socket from '../socket/socket'

var encryptedSocket = {
    emit: undefined,
    on: undefined
}

var keysToClients = {}

function initializeEncryptionToAnotherClient() { }

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

        initializeEncryptionToAnotherClient = (username) => {
            const key = new NodeRSA({ b: 2048 })
            if (!keysToClients[username]) {
                keysToClients[username] = {
                    destination: {
                        public: undefined
                    },
                    local: {
                        public: key.exportKey('pkcs1-public-pem'),
                        private: key.exportKey('pkcs1-private-pem')
                    }
                }

                encryptedSocket.emit('e', {
                    event: 'msg>specific',
                    data: {
                        event: 'b',
                        specificMsg: true,
                        to: searchInputRef.current.value,
                        data: keysToClients[searchInputRef.current.value].local.public
                    }
                })
            }
        }

        encryptedSocket.on('e', (data) => {
            if (data.specificMsg) {
                switch (data.event) {
                    case 'b':
                        if (keysToClients[data.from]) {
                            if (keysToClients[data.from].local.public && keysToClients[data.from].local.private) {
                                keysToClients[data.from].destination = data.data


                            }
                        } else {
                            const key = new NodeRSA({ b: 2048 })
                            keysToClients[data.from] = {
                                destination: {
                                    public: data.data
                                },
                                local: {
                                    public: key.exportKey('pkcs1-public-pem'),
                                    private: key.exportKey('pkcs1-private-pem')
                                }
                            }

                            encryptedSocket.emit('e', {
                                event: 'msg>specific',
                                data: {
                                    event: 'b',
                                    specificMsg: true,
                                    to: searchInputRef.current.value,
                                    data: keysToClients[data.from].local.public
                                }
                            })
                        }
                        break;

                    default:
                        break;
                }
            } else {

            }
        })
    })
}


export default encryptedSocket
export { encryptedSocket, initializeEncryptionToServer, keysToClients, initializeEncryptionToAnotherClient }
