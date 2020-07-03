const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 80
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const fs = require('fs');

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

    var db = {
        users: './data/users.json',
        connections: './data/connections.json'
    }

    var io = require('socket.io')(http)
    io.on('connection', (socket) => {
        console.log(`connection - ${socket.id}`);

        socket.on('connectUsername', (data) => {
            fs.readFile(db.connections, 'utf8', (err, data) => {
                if (err) throw err
                var tmp = JSON.parse(data.toString())
                if (tmp[data]) {
                    socket.emit('err', 'username exists')
                } else {
                    tmp[data] = socket.id
                    fs.writeFile(db.users, JSON.stringify(tmp), {
                        encoding: 'utf8'
                    })
                }
            })
        })
    })

    http.listen(port, (err) => {
        if (err) throw err
        console.log(`ready - started server on http://localhost:${port}`)
    })
})
