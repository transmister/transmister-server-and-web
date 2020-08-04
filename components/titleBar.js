import styles from "./titleBar.module.css"
import SearchBar from "./titleBar/searchBar"
import Title from "./titleBar/title"
import Avatar from "./titleBar/avatar"

export default function TitleBar({ title, setFlyoutContent, setFlyoutOpen, signedIn, setSignedIn }) {
    return (
        <div className={styles.titleBar}>
            <SearchBar signedIn={signedIn}></SearchBar>
            <Title text={title}></Title>
            <Avatar signedIn={signedIn} setSignedIn={setSignedIn} setFlyoutContent={setFlyoutContent} setFlyoutOpen={setFlyoutOpen}>Sign In</Avatar>
        </div>
    )
}