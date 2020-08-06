// server
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 80
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// db
const mongoose = require('mongoose')
const db = require('./models/db')

// log
const keepLog = require('./log')

mongoose.connect('mongodb://localhost:27017/transmister', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 5,
    keepAlive: true,
}).then(() => {
    keepLog('event', 'db', 'connection', 'success')
    app.prepare().then(() => {
        var http = createServer((req, res) => {
            const parsedUrl = parse(req.url, true)
            // const parsedUrl = new URL(req.url, "https://my.domain")
            const { pathname, query } = parsedUrl

            if (pathname === '/') {
                app.render(req, res, '/', query)
            } else {
                handle(req, res, parsedUrl)
            }
        })

        const NodeRSA = require('node-rsa')
        const io = require('socket.io')(http)

        io.on('connection', (socket) => {
            keepLog('event', 'io', 'connection', socket.id)

            const encryptedSocket = {
                emit: (event, data) => {
                    db.connections.findOne({ socketId: socket.id }).then(row => {
                        if (row) {
                            socket.emit(event, new NodeRSA()
                                .importKey(row.key.client.public, 'pkcs1-public-pem')
                                .encrypt(JSON.stringify(data), 'base64')
                            )
                        }
                    }).catch((ex) => {
                        keepLog('error', 'encryptedSocket', 'failed', ex)
                    })
                },
                on: (event, listener) => {
                    socket.on(event, (data) => {
                        db.connections.findOne({ socketId: socket.id }).then(row => {
                            if (row) {
                                listener(JSON.parse(new NodeRSA().importKey(row.key.server.private, 'pkcs1-private-pem').decrypt(data, 'utf8')))
                            }
                        }).catch((ex) => {
                            keepLog('error', 'encryptedSocket', 'failed', ex)
                        })
                    })
                },
                emitToSpecific: (socketId, event, data) => {
                    db.connections.findOne({ socketId: socketId }).then((row) => {
                        if (row) {
                            io.sockets.connected[socketId].emit(
                                event,
                                new NodeRSA()
                                    .importKey(row.key.client.public, 'pkcs1-public-pem')
                                    .encrypt(
                                        JSON.stringify(data), 'base64'
                                    )
                            )
                        }
                    })
                }
            }

            socket.on('b', (data) => {
                keepLog('event', 'socket', 'b', `${socket.id} - receive - client public key`)

                const key = new NodeRSA({ b: 1024 })

                const connectionsSaver = () => {
                    new db.connections({
                        socketId: socket.id,
                        key: {
                            client: {
                                public: data
                            },
                            server: {
                                public: key.exportKey('pkcs1-public-pem'),
                                private: key.exportKey('pkcs1-private-pem')
                            }
                        }
                    }).save().then(() => {
                        keepLog('event', 'socket', 'b', `${socket.id} - save   - client public key`)
                    }).catch((e) => {
                        keepLog('error', 'socket', 'b', `${socket.id} - save   - failed - client public key - ${e}`)
                    })
                }
                db.connections.findOne({ socketId: socket.id }).then((row) => {
                    if (row) {
                        row.deleteOne().then(connectionsSaver)
                    } else {
                        connectionsSaver()
                    }
                })


                socket.emit('b', key.exportKey('pkcs1-public-pem'))
                keepLog('event', 'socket', 'b', `${socket.id} - send  - server public key`)

                encryptedSocket.on('e', (data) => {
                    switch (data.event) {
                        case 'test':
                            keepLog('event', 'encryptedSocket', 'e', `${socket.id} - test  - receive test message > content: ${data.testMsg}`)
                            break;

                        case 'signUp':
                            keepLog('event', 'encryptedSocket', 'e', `${socket.id} - signUp  - receive sign up message > username: ${data.data.username}`)
                            db.users.findOne({ username: data.data.username }).then((row) => {
                                if (!row) {
                                    new db.users({
                                        username: data.data.username,
                                        passwordSHA512: data.data.passwordSHA512
                                    }).save().then((row) => {
                                        db.connections.findOneAndUpdate({ socketId: socket.id }, { username: data.data.username })
                                        encryptedSocket.emit('e', {
                                            event: 'success',
                                            data: {
                                                successId: 'signUp.success'
                                            }
                                        })
                                        keepLog('event', 'encryptedSocket', 'e', `${socket.id} - signUp  - success - save sign up info to db > username: ${row.username}`)
                                    })

                                } else {
                                    encryptedSocket.emit('e', {
                                        event: 'error',
                                        data: {
                                            errId: 'signUp.usernameIsTaken'
                                        }
                                    })
                                    keepLog('error', 'encryptedSocket', 'e', `${socket.id} - signUp  - failed  - username: ${data.data.username} is already taken`)
                                }
                            })
                            break;

                        case 'signIn':
                            keepLog('event', 'encryptedSocket', 'e', `${socket.id} - signIn  - receive sign in message > username: ${data.data.username}`)

                            db.users.findOne({
                                username: data.data.username,
                                passwordSHA512: data.data.passwordSHA512
                            }).then(row => {
                                if (!row) {
                                    encryptedSocket.emit('e', {
                                        event: 'error',
                                        data: {
                                            errId: 'signIn.incorrectUsernameOrPassword'
                                        }
                                    })
                                    keepLog('error', 'encryptedSocket', 'e', `${socket.id} - signIn  - failed - incorrect username or passowrd`)
                                } else {
                                    db.connections.findOneAndUpdate({ socketId: socket.id }, { username: data.data.username }).then(() => {
                                        encryptedSocket.emit('e', {
                                            event: 'success',
                                            data: {
                                                successId: 'signIn.success'
                                            }
                                        })
                                        keepLog('event', 'encryptedSocket', 'e', `${socket.id} - signIn  - success - sign in success > username: ${row.username}`)
                                    }).catch(() => {
                                        keepLog('error', 'encryptedSocket', 'e', `${socket.id} - signIn  - failed - sign in failed when saving to db > username: ${row.username}`)
                                    })
                                }
                            })
                            break;

                        case 'msg>specific':
                            // Find whether this target user is online
                            db.connections.findOne({ username: data.data.to }).then((rowD) => {
                                // If online
                                if (rowD) {
                                    // Find out who is signed in with this `socket.id`
                                    db.connections.findOne({ socketId: socket.id }).then((rowL) => {
                                        // If found who is signed in
                                        if (rowL) {
                                            // Record the authenticated username into data
                                            data.data['from'] = rowL.username
                                            // Send to target
                                            encryptedSocket.emitToSpecific(rowD.socketId, 'e', data.data)
                                            keepLog('event', 'encryptedSocket', 'msg>specific', `${socket.id} - specificMsg - success - sent a specific msg`)

                                        // If isn't signed in, refuse to send
                                        } else {
                                            encryptedSocket.emit('e', {
                                                event: 'error',
                                                data: {
                                                    errId: 'notSignedIn'
                                                }
                                            })
                                            keepLog('error', 'encryptedSocket', 'msg>specific', `${socket.id} - specificMsg - failed - not signed in so cannot send a specific msg`)
                                        }
                                    })
                                }
                            })
                            break;

                        default:
                            break;
                    }
                })
            })

            socket.on('disconnect', (reason) => {
                keepLog('event', 'socket', 'disconnect', socket.id)

                // delete when the user disconnect to the server
                db.connections.findOneAndDelete({ socketId: socket.id }).then((row) => {
                    keepLog('event', 'socket', 'disconnect', `${socket.id} - delete  - recent connection`)
                }).catch((e) => {
                    keepLog('error', 'socket', 'disconnect', `${socket.id} - delete  - recent connection`)
                })
            })
        })

        http.listen(port, (err) => {
            if (err) throw err
            keepLog('ready', `started server on http://localhost:${port}`)
        })
    })
}).catch((ex) => {
    keepLog('error', 'db', 'connection', `failed  - ${ex.message}`)
})
