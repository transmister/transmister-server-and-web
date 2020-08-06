import socket from '../socket/socket'

var encryptedSocket = {
    emit: undefined,
    on: undefined,
    specific: {
        /**
         *
         * @param {string} username
         * @param {string} event must start with `specificMsg.`, like `specificMsg.b`
         * @param {Function} listener the function receives `data`
         */
        emit: undefined,
        /**
         *
         * @param {string} username
         * @param {string} event must start with `specificMsg.`, like `specificMsg.b`
         * @param {Function} listener the function receives `data`
         */
        on: undefined
    }
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

        // JSDoc at line 7
        encryptedSocket.specific.emit = (username, event, data) => {
            encryptedSocket.emit('e', {
                event: 'msg>specific',
                data: {
                    event: event,
                    specificMsg: true,
                    to: username,
                    data: new NodeRSA()
                        .importKey(keysToClients[username].destination.public, 'pkcs1-public-pem')
                        .encrypt(JSON.stringify(data), 'base64')
                }
            })
        }

        // JSDoc at line 14
        encryptedSocket.specific.on = (username, event, listener) => {
            encryptedSocket.on('e', (data) => {
                if (data.specificMsg && data.from == username && data.event == event) {
                    listener(JSON.parse(new NodeRSA().importKey(keysToClients[username].local.private, 'pkcs1-private-pem').decrypt(data.data)))
                }
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
                        event: 'specificMsg.b',
                        specificMsg: true,
                        to: searchInputRef.current.value,
                        data: keysToClients[searchInputRef.current.value].local.public
                    }
                })
            }
        }

        encryptedSocket.on('e', (data) => {
            // If it's a specific message
            if (data.specificMsg) {
                switch (data.event) {
                    // The case to initialize client-to-client end-to-end encryption
                    case 'specificMsg.b':
                        // If we already have the key to `data.from` (maybe incomplete)
                        if (keysToClients[data.from]) {
                            // If we only our own keys, save the key to `data.from`
                            if (keysToClients[data.from].local.public && keysToClients[data.from].local.private) {
                                keysToClients[data.from].destination = data.data
                            }
                        // If we don't have any keys
                        } else {
                            // Initializa a new key, length: 2048
                            const key = new NodeRSA({ b: 2048 })
                            // Save the new key to `keysToClients`
                            keysToClients[data.from] = {
                                destination: {
                                    public: data.data
                                },
                                local: {
                                    public: key.exportKey('pkcs1-public-pem'),
                                    private: key.exportKey('pkcs1-private-pem')
                                }
                            }

                            // Send our public key to `data.from`
                            encryptedSocket.emit('e', {
                                event: 'msg>specific',
                                data: {
                                    event: 'specificMsg.b',
                                    specificMsg: true,
                                    to: data.from,
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
