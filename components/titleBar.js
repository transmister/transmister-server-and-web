import styles from "./titleBar.module.css"
import SearchBar from "./titleBar/searchBar"
import Title from "./titleBar/title"

export default function TitleBar(props) {
    return (
        <div className={styles.titleBar}>
            <SearchBar></SearchBar>
            <Title text={props.title}></Title>
        </div>
    )
}