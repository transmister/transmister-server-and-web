const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

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

    // var db = {
    //     users: './data/users.json',
    //     connections: './data/connections.json'
    // }

    var db = {
        users: {},
        connections: {}
    }

    const NodeRSA = require('node-rsa')

    var io = require('socket.io')(http)
    io.on('connection', (socket) => {
        console.log(`event - io     - connection - ${socket.id}`)

        const encryptedSocket = {
            emit: (event, data, publicKey) => {
                const key = new NodeRSA()
                key.importKey(publicKey, 'pkcs1-public-pem')
                socket.emit(event, key.encrypt(data))
            },
            on: (event, listener, privateKey) => {
                socket.on(event, (data) => {
                    const key = new NodeRSA()
                    key.importKey(privateKey, 'pkcs1-private-pem')
                    listener(key.decrypt(data))
                })
            }
        }

        socket.on('b', (data) => {
            console.log(`event - socket - b          - ${socket.id} - receive - client public key`)

            const key = new NodeRSA({ b: 1024 })
            db.connections[socket.id] = {
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

            socket.emit('b', key.exportKey('pkcs1-public-pem'))
            console.log(`event - socket - b          - ${socket.id} - send    - server public key`)

            fs.writeFile('./data/.tmp', JSON.stringify(db.connections), () => { })

            delete key

            encryptedSocket.on('e', (data) => {
                switch (data['event']) {
                    case 'test':
                        console.log(`${socket.id} tested successful!!! - ${data}`)
                        break;

                    default:
                        break;
                }
            }, db.connections[socket.id].key.client.public)
        })

        socket.on('disconnect', (reason) => {
            console.log(`event - socket - disconnect - ${socket.id}`)

            delete db.connections[socket.id]
            fs.writeFile('./data/.tmp', JSON.stringify(db.connections), () => { })
        })
    })

    http.listen(port, (err) => {
        if (err) throw err
        console.log(`ready - started server on http://localhost:${port}`)
    })
})
