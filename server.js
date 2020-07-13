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

        socket.on('b', (data) => {
            db.connections[socket.id].key.client.public = data
            const key = new NodeRSA({ b: 1024 })
            db.connections[socket.id].key.server.public = key.exportKey('pkcs1-public-pem')
            db.connections[socket.id].key.server.private = key.exportKey('pkcs1-private-pem')
            socket.emit('b', key.exportKey('pkcs1-public-pem'))

            console.log(db.connections[socket.id])
        })

        socket.on('e', (data) => {
            switch (data.event) {
                case "signIn":
                    break;

                case "signUp":
                    break;

                default:
                    socket.emit('c', {
                        event: "error",
                        desc: "Invalid event name"
                    })
                    break;
            }
        })

        socket.on('disconnect', (reason) => {
            console.log(`event - socket - disconnect - ${socket.id}`)
        })
    })

    http.listen(port, (err) => {
        if (err) throw err
        console.log(`ready - started server on http://localhost:${port}`)
    })
})
