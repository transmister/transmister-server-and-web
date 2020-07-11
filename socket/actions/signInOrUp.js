import socket from '../socket'

/**
 * Send sign in or sign up data to server
 * @param {String} signInOrUp `"signIn"` to sign in, `"signUp"` to sign up
 * @param {String} username The username
 * @param {String} password The password
 * @param {Function} callback Callback function
 */
export default function signInOrUp(signInOrUp, username, password, callback) {
    socket.emit("e", {
        event: signInOrUp,
        data: {
            username: username,
            password: password
        }
    })
    callback()
}
