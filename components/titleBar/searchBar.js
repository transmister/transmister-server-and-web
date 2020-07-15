import styles from "./searchBar.module.css"
// import languageString from '../../string/string'

export default function SearchBar() {
    return (
        <input placeholder="Search" className={styles.searchBar}/>
        // <input placeholder={languageString['Search']} className={styles.searchBar}/>
    )
}