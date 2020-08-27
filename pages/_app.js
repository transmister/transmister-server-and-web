import '../global/global.css'
import { initializeEncryptionToServer } from '../socket/encryption'

initializeEncryptionToServer()

export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />
}
