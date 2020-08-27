import styles from "./searchBar.module.css"
import Button from '../button'
import { initializeEncryptionToAnotherClient } from "../../socket/encryption"

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
                    var inMaster = false
                    for (const i in master) {
                        if (master[i].key == status.username) {
                            inMaster = true
                        }
                    }
                    if (!inMaster) {
                        const appendToMaster = [{
                            key: status.username,
                            title: status.username,
                            description: 'Encryption initialized',
                        }, ...master]
                        setMaster(appendToMaster)
                    }
                }).catch((error) => { console.log(error) })

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