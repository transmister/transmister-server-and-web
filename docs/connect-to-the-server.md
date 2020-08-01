# Connect to the Server

To connect to the server, you need to install [socket.io](https://socket.io/) to your project.

When the server is running as the default configuration, you can visit http://localhost:80 locally by the browser on the server, or the server's IP address, hostname or domain.

Use socket.io to connect to the address of the web version of Transmister. In JavaScript, it looks like this:

```javascript
const io = require('socket.io-client');
const socket = io('http://localhost');
```

## References

- https://socket.io/docs/client-api/
- https://github.com/socketio/socket.io-client-java#usage
- https://github.com/socketio/socket.io-client-cpp#connect-to-a-server
- https://github.com/socketio/socket.io-client-swift#example
- https://github.com/rikulo/socket.io-client-dart#usage
