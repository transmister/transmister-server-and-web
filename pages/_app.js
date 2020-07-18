import '../global/global.css'
import { initializeEncryptionToServer } from '../encryption/client'

export default function App({ Component, pageProps }) {
    initializeEncryptionToServer()
    return <Component {...pageProps} />
}
