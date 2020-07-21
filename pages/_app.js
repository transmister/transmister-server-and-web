import '../global/global.css'
import { initializeEncryptionToServer } from '../socket/encryption'

export default function App({ Component, pageProps }) {
    initializeEncryptionToServer()
    return <Component {...pageProps} />
}
