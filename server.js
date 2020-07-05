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

    var dbIO = []

    var io = require('socket.io')(http)
    io.on('connection', (socket) => {
        console.log(`event - io     - connection - ${socket.id}`);

        function objEdit(obj, attr, value) {
            if (value && value != "") {
                obj[attr] = value
                return obj
            } else {
                delete obj[attr]
                return obj
            }
        }

        socket.on('e', (data) => {
            switch (data.event) {
                case "signIn":
                    break;

                case "signUp":
                    dbIO.push({
                        db: db.users,
                        attr: data.data.username,
                        value: {
                            password: data.data.password
                        }
                    })
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
            console.log(`event - socket - disconnect - ${socket.id}`);

            fs.readFile(db.connections, 'utf8', (err, file) => {
                if (err) throw err
                var tmp = JSON.parse(file.toString())
                tmp = objEdit(tmp, socket.id)
                fs.writeFile(db.connections, JSON.stringify(tmp), () => { })
            })
        })
    })

    http.listen(port, (err) => {
        if (err) throw err
        console.log(`ready - started server on http://localhost:${port}`)
    })
})
