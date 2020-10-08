import styles from "./searchBar.module.css"
import Button from '../button'
import { initializeEncryptionToAnotherClient, encryptedSocket } from "../../socket/encryption"

export default function SearchBar({ signedIn, master, setMaster }) {
    const [searchInputPlaceholder, setSearchInputPlaceholder] = React.useState('Search')
    var searchInputRef = React.createRef()
    const [addButtonText, setAddButtonText] = React.useState('+')
    var status = 'search'

    const addContact = () => {
        const targetUser = searchInputRef.current.value;
        if (signedIn) {
            if (targetUser && targetUser != signedIn.username) {
                // Clear the input
                status = 'search'
                searchInputRef.current.blur()
                searchInputRef.current.value = ''
                setSearchInputPlaceholder('Search')

                initializeEncryptionToAnotherClient(targetUser).then((status) => {
                    encryptedSocket.specific.on(status.username, 'test', (data) => {
                        if (data == status.username) {
                            // Tested successful
                        }
                    })
                    encryptedSocket.specific.emit(status.username, 'test', signedIn.username)
                }).catch((error) => { console.error(error) })

            } else {
                status = 'addContact'
                searchInputRef.current.focus()
                setSearchInputPlaceholder('Contact to...')
            }
        }
    }

    return (<div className={styles.searchBar}>
        <input placeholder={searchInputPlaceholder} className={styles.searchInput} onKeyDown={(e) => {
            if (e.keyCode == 13 && e.target.value && status == 'addContact') {
                addContact()
            } else if ((e.keyCode == 13 || e.keyCode == 27) && !e.target.value && status == 'addContact') {
                status = 'search'
                setSearchInputPlaceholder('Search')
            }
        }} ref={searchInputRef} disabled={!signedIn} style={{ opacity: (signedIn ? null : 0), transform: `scale(${signedIn ? 1 : 0.8})` }} />
        <Button className={styles.addBtn} onClick={() => {
            addContact()
        }} disabled={!signedIn} style={{ opacity: (signedIn ? null : 0), transform: `scale(${signedIn ? 1 : 0.8})` }}>{addButtonText}</Button>
    </div>)
}