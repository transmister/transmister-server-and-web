import { encryptedSocket } from '../encryption'

/**
 * Send sign in or sign up data to server
 * @param {String} signInOrUp `"signIn"` to sign in, `"signUp"` to sign up
 * @param {Object} userData The userData
 * @param {Function} callback Callback function
 */
export default function userAction(signInOrUp: 'signIn' | 'signUp', userData: Object, callback: Function) {
    encryptedSocket.emit('e', {
        event: signInOrUp,
        data: {...userData}
    })

    encryptedSocket.on('e', (data) => {
        callback(data)
    })

    // if (typeof callback == 'function') {
    //     callback()
    // }
}
