const mongoose = require('mongoose')
const db = require('./models/db')

mongoose.connect('mongodb://localhost:27017/transmister', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 5,
    keepAlive: true,
}).then(() => {
    console.log('Deleting connection data...')
    db.connections.deleteMany({}).then(() => {
        console.log('Connection data deleted.')
        console.log('Exited.')
        process.exit(0)
    }).catch((err) => {
        console.log('Error occured when deleting connection data:\n', err)
        console.log('Exited.')
        process.exit(0)
    })
})
