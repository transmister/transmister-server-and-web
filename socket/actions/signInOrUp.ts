import { encryptedSocket } from '../encryption'

/**
 * Send sign in or sign up data to server
 * @param {String} signInOrUp `"signIn"` to sign in, `"signUp"` to sign up
 * @param {String} username The username
 * @param {String} password The password
 * @param {Function} callback Callback function
 */
export default function signInOrUp(signInOrUp: 'signIn' | 'signUp', username: string, password: string, callback: Function) {
    encryptedSocket.emit('e', {
        event: signInOrUp,
        data: {
            username: username,
            password: password
        }
    })

    encryptedSocket.on('e', (data) => {
        callback(data)
    })

    // if (typeof callback == 'function') {
    //     callback()
    // }
}
