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
const linkers = require('./models/linkers')

// log
// const keepLog = require('./log')

mongoose.connect('mongodb://localhost:27017/transmister', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 5,
    keepAlive: true,
}).then(() => {
    console.log(`event - db              - connection - success`)
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
            console.log(`event - io              - connection - ${socket.id}`)

            const encryptedSocket = {
                emit: (event, data, publicKey) => {
                    socket.emit(event, new NodeRSA().importKey(publicKey, 'pkcs1-public-pem').encrypt(data, 'base64'))
                },
                on: (event, listener) => {
                    socket.on(event, (data) => {
                        linkers.findOne({ socketId: socket.id }).then(row => {
                            if (row) {
                                listener(new NodeRSA().importKey(row.key.server.private, 'pkcs1-private-pem').decrypt(data, 'utf8'))
                            }
                        }).catch((ex) => {
                            console.log(ex)
                        })
                    })
                }
            }

            socket.on('b', (data) => {
                console.log(`event - socket          - b          - ${socket.id} - receive - client public key`)

                const key = new NodeRSA({ b: 1024 })

                linkers.findOne({ socketId: socket.id }).then((ret) => {
                    if (ret) {
                        linkers.findOneAndDelete({ socketId: socket.id }).then((ret) => {
                            console.log(`event - socket          - b          - ${socket.id} - save     - client public key`)
                        }).catch((ex) => {
                            console.log(`event - socket          - b          - ${socket.id} - save     - client public key`)
                        })
                    }

                    new linkers({
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
                    }).save()
                })


                socket.emit('b', key.exportKey('pkcs1-public-pem'))
                console.log(`event - socket          - b          - ${socket.id} - send    - server public key`)

                encryptedSocket.on('e', (data) => {
                    data = JSON.parse(data)

                    switch (data['event']) {
                        case 'test':
                            console.log(`event - encryptedSocket - e          - ${socket.id} - test    - receive test message > content: ${data.testMsg}`)
                            break;

                        default:
                            break;
                    }
                })
            })

            socket.on('disconnect', (reason) => {
                console.log(`event - socket          - disconnect - ${socket.id}`)

                // delete when the user disconnect to the server
                linkers.findOneAndDelete({ socketId: socket.id }).then((ret) => {
                    console.log(`event - socket          - disconnect - ${socket.id} - delete  - recent keys`)
                }).catch((ex) => {
                    console.log(`error - socket          - disconnect - ${socket.id} - delete  - recent keys - ${ex}`)
                })
            })
        })

        http.listen(port, (err) => {
            if (err) throw err
            console.log(`ready - started server on http://localhost:${port}`)
        })
    })
}).catch((ex) => {
    console.log(`error - db              - connection - failed  - ${ex.message}`);
})
