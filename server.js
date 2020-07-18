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
                emit: (event, data, publicKey) => {
                    socket.emit(event, new NodeRSA().importKey(publicKey, 'pkcs1-public-pem').encrypt(JSON.stringify(data), 'base64'))
                },
                on: (event, listener) => {
                    socket.on(event, (data) => {
                        db.connections.findOne({ socketId: socket.id }).then(row => {
                            if (row) {
                                listener(JSON.parse(new NodeRSA().importKey(row.data.key.server.private, 'pkcs1-private-pem').decrypt(data, 'utf8')))
                            }
                        }).catch((ex) => {
                            keepLog('error', 'encryptedSocket', 'failed', ex)
                        })
                    })
                }
            }

            socket.on('b', (data) => {
                keepLog('event', 'socket', 'b', `${socket.id} - receive - client public key`)

                const key = new NodeRSA({ b: 1024 })

                db.connections.findOne({ socketId: socket.id }).then((ret) => {
                    if (ret) {
                        db.connections.findOneAndDelete({ socketId: socket.id }).then((ret) => {
                            keepLog('event', 'socket', 'b', `${socket.id} - save     - client public key`)
                        }).catch((ex) => {
                            keepLog('error', 'socket', 'b', `${socket.id} - save     - failed - client public key`)
                        })
                    }

                    new db.connections({
                        socketId: socket.id,
                        data: {
                            key: {
                                client: {
                                    public: data
                                },
                                server: {
                                    public: key.exportKey('pkcs1-public-pem'),
                                    private: key.exportKey('pkcs1-private-pem')
                                }
                            }
                        }
                    }).save()
                })


                socket.emit('b', key.exportKey('pkcs1-public-pem'))
                keepLog('event', 'socket', 'b', `${socket.id} - send    - server public key`)

                encryptedSocket.on('e', (data) => {
                    switch (data['event']) {
                        case 'test':
                            keepLog('event', 'encryptedSocket', 'e', `${socket.id} - test    - receive test message > content: ${data.testMsg}`)
                            break;

                        case 'signUp':
                            keepLog('event', 'encryptedSocket', 'e', `${socket.id} - signUp  - receive sign up message > username: ${data.data.username}`)
                            new db.users({
                                username: data.data.username,
                                password: data.data.password
                            }).save()
                            keepLog('event', 'encryptedSocket', 'e', `${socket.id} - signUp  - success - save sign up info to db > username: ${db.users.findOne({ username: data.data.username }).then((ret) => { return ret.username })}`)

                        default:
                            break;
                    }
                })
            })

            socket.on('disconnect', (reason) => {
                keepLog('event', 'socket', 'disconnect', socket.id)

                // delete when the user disconnect to the server
                db.connections.findOneAndDelete({ socketId: socket.id }).then((ret) => {
                    keepLog('event', 'socket', 'disconnect', `${socket.id} - delete  - recent connection`)
                }).catch((ex) => {
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
