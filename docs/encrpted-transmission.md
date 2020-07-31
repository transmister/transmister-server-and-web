# Encrpted Transmission

To send encrypted message to the server by socket.io, you need to initialize a pair of RSA keys then send to the server.

## Initialize a Pair of RSA Keys

The length of the pair RSA keys must be 1024 or greater, After initialization, send the public key in **PKCS#1 PEM** format to the server with `event: 'b'`:

```javascript
socket.emit('b', publicKey)
```

**PKCS#1 PEM** format:
```
-----BEGIN RSA PUBLIC KEY-----
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
-----END RSA PUBLIC KEY-----
```

**Remember to save your private key!**

Then server will initialize a pair of RSA keys and send it in **PKCS#1 PEM** format to you with `event: 'b'`, you should receive it like this:

```javascript
socket.on('b', (publicKey) => { /* save `publicKey` */ })
```

After that, you should send and receive all the messages with encryption with `event: 'e'`:

```javascript
socket.emit('e', encrypt(data, serverPublicKey))
socket.on('e', (data) => {
    listener(decrypt(data, clientPrivateKey))
})
```

Also all the sent or received messages are in JSON format as the [fixed structure](./message-structure.md). You can encapsulate this feature, this is a demo in JavaScript:

```javascript
// From transmister/transmister-server-and-web
// Branch: master
// Path:   socket/encryption.js
// Line:   27
// Link:   https://github.com/transmister/transmister-server-and-web/blob/master/socket/encryption.js#L27

const NodeRSA = require('node-rsa')

encryptedSocket.emit = (event, data) => {
    socket.emit(event, new NodeRSA().importKey(keyPair.server.public, 'pkcs1-public-pem').encrypt(JSON.stringify(data), 'base64')
    )
}

encryptedSocket.on = (event, listener) => {
    socket.on(event, (data) => {
        listener(
            JSON.parse(
                new NodeRSA().importKey(keyPair.client.private, 'pkcs1-private-pem').decrypt(data, 'utf8')
            )
        )
    })
}
```
