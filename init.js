console.error('\ninitializing transmister-server-and-web\n')

const fs = require('fs')

fs.writeFileSync('./data/users.json', '{}')
console.log('new file - path:    ./data/users.json')
console.log(`           content: ${fs.readFileSync('./data/users.json')}`)
fs.writeFileSync('./data/connections.json', '{}')
console.log('new file - path:    ./data/connections.json')
console.log(`           content: ${fs.readFileSync('./data/connections.json')}`)

console.log('\ntransmister-server-and-web is initialized\n')

console.log('to start the server, run:')
console.log('                         > npm install')
console.log('                         > npm run build')
console.log('                         > npm start\n')
