import socket from '../socket/socket'

// c2c = client to client
var c2cEncryptionEvents = {
    listeners: {},
    on: (event, listener) => {
        let listenerPosition;
        if (typeof c2cEncryptionEvents.listeners[event] != 'undefined') {
            listenerPosition = c2cEncryptionEvents.listeners[event].push(listener) - 1
        } else {
            c2cEncryptionEvents.listeners[event] = [listener]
            listenerPosition = 0
        }
        return listenerPosition
    },
    trigger: (event, params) => {
        for (const i in c2cEncryptionEvents.listeners[event]) {
            let listener = c2cEncryptionEvents.listeners[event][i]
            if (typeof listener == 'function') {
                listener(params)
            }
        }
        return
    },
}

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

        initializeEncryptionToAnotherClient = (username) => {
            return new Promise((resolve, reject) => {
                if (!keysToClients[username]) {
                    const key = new NodeRSA({ b: 2048 })
                    keysToClients[username] = {
                        destination: {
                            public: undefined
                        },
                        local: {
                            public: key.exportKey('pkcs1-public-pem'),
                            private: key.exportKey('pkcs1-private-pem')
                        }
                    }

                    encryptedSocket.on('e', (data) => {
                        if (data.specificMsg) {
                            if (data.event == 'specificMsg.b' && data.from == username) {
                                resolve({
                                    status: 'success',
                                    keys: keysToClients[data.from],
                                    username: username
                                })
                                c2cEncryptionEvents.trigger('update', { username: username })
                                clearTimeout(timeout)
                            }
                        }
                    })

                    var timeout = setTimeout(() => {
                        reject({
                            status: 'encryption timeout',
                            username: username
                        })
                    }, 30000);

                    encryptedSocket.emit('e', {
                        event: 'msg>specific',
                        data: {
                            event: 'specificMsg.b',
                            specificMsg: true,
                            to: username,
                            data: keysToClients[username].local.public
                        }
                    })
                }
            })
        }

        encryptedSocket.on('e', (data) => {
            // If it's a specific message
            if (data.specificMsg) {
                switch (data.event) {
                    // The case to initialize client-to-client end-to-end encryption
                    case 'specificMsg.b':
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

                        c2cEncryptionEvents.trigger('update', { username: data.from })
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
export { encryptedSocket, initializeEncryptionToServer, keysToClients, initializeEncryptionToAnotherClient, c2cEncryptionEvents }
