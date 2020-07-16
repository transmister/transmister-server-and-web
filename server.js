const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

require('./db/mongoose')

const Connections = require('./models/connections')

const port = parseInt(process.env.PORT, 10) || 80
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const fs = require('fs')

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

    // var db = {
    //     users: './data/users.json',
    //     connections: './data/connections.json'
    // }

    // var db = {
    //     users: {},
    //     connections: {}
    // }

    io.on('connection', (socket) => {

        const socketId = socket.id;

        console.log(`event - io              - connection - ${socketId}`)

        const encryptedSocket = {
            emit: (event, data, publicKey) => {
                socket.emit(event, new NodeRSA().importKey(publicKey, 'pkcs1-public-pem').encrypt(data, 'base64'))
            },
            // on: (event, listener, privateKey) => {
            //     socket.on(event, (data) => {
            //         listener(new NodeRSA().importKey(privateKey, 'pkcs1-private-pem').decrypt(data, 'utf8'))
            //     })
            // }

            on: (event, listener, socketId) => {
                socket.on(event, (data) => {
                    let cItem = Connections.findBySocketId(socketId);
                    if(cItem) listener(new NodeRSA().importKey(cItem.key.server.private, 'pkcs1-private-pem').decrypt(data, 'utf8'))
                })
            }
        }

        socket.on('b', (data) => {
            console.log(`event - socket          - b          - ${socketId} - receive - client public key`)

            const key = new NodeRSA({ b: 1024 })
            // db.connections[socket.id] = {
                // key: {
                //     client: {
                //         public: data
                //     },
                //     server: {
                //         public: key.exportKey('pkcs1-public-pem'),
                //         private: key.exportKey('pkcs1-private-pem')
                //     }
                // }
            // }

            Connections.save({
                socketId: socketId,
                key: {
                    client: {
                        public: data
                    },
                    server: {
                        public: key.exportKey('pkcs1-public-pem'),
                        private: key.exportKey('pkcs1-private-pem')
                    }
                }
            })



            socket.emit('b', key.exportKey('pkcs1-public-pem'))
            console.log(`event - socket          - b          - ${socketId} - send    - server public key`)

            // fs.writeFile('./data/.tmp', JSON.stringify(db.connections), () => { })

            // delete key

            encryptedSocket.on('e', (data) => {
                data = JSON.parse(data)

                switch (data['event']) {
                    case 'test':
                        console.log(`event - encryptedSocket - e          - ${socketId} - test    - receive test message > content: ${data.testMsg}`)
                        break;

                    default:
                        break;
                }
            }, socketId)
            // }, db.connections[socket.id].key.server.private)
        })

        socket.on('disconnect', (reason) => {
            console.log(`event - socket          - disconnect - ${socketId}`)

            // delete db.connections[socket.id]
            // fs.writeFile('./data/.tmp', JSON.stringify(db.connections), () => { })

            Connections.findOneAndDelete({socketId: socket.id})
        })
    })

    http.listen(port, (err) => {
        if (err) throw err
        console.log(`ready - started server on http://localhost:${port}`)
    })
})
