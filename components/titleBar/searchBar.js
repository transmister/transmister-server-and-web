import styles from "./searchBar.module.css"

export default function SearchBar() {
    return (
        <input placeholder="Search" className={styles.searchBar}/>
    )
}