import styles from "./searchBar.module.css"
import Button from '../button'
import encryptedSocket, { keysToClients } from "../../socket/encryption"
import NodeRSA from "node-rsa"

export default function SearchBar({ signedIn }) {
    const [searchInputPlaceholder, setSearchInputPlaceholder] = React.useState('Search')
    var searchInputRef = React.createRef()
    const [addButtonText, setAddButtonText] = React.useState('+')
    var status = 'search'

    const addContact = () => {
        if (searchInputRef.current.value) {
            const key = new NodeRSA({ b: 2048 })
            keysToClients[searchInputRef.current.value] = {
                destination: {
                    public: undefined
                },
                local: {
                    public: key.exportKey('pkcs1-public-pem'),
                    private: key.exportKey('pkcs1-private-pem')
                }
            }

            encryptedSocket.emit('e', {
                event: 'msg>specific',
                data: {
                    username: searchInputRef.current.value,
                    data: {
                        event: 'msg>specific.b',
                        data: {
                            publicKey: keysToClients[searchInputRef.current.value].local.public
                        }
                    }
                }
            })
            status = 'search'
            searchInputRef.current.blur()
            searchInputRef.current.value = ''
            setSearchInputPlaceholder('Search')
        } else {
            status = 'addContact'
            searchInputRef.current.focus()
            setSearchInputPlaceholder('Contact to ...')
        }
    }

    return (<div className={styles.searchBar}>
        <input placeholder={searchInputPlaceholder} className={styles.searchInput} onKeyDown={(e) => {
            if (e.keyCode == 13 && e.target.value && status == 'addContact') {
                addContact()
            } else if (e.keyCode == 13 && !e.target.value && status == 'addContact') {
                status = 'search'
                setSearchInputPlaceholder('Search')
            }
        }} ref={searchInputRef} />
        <Button className={styles.addBtn} onClick={() => {
            addContact()
        }}>{addButtonText}</Button>
    </div>)
}