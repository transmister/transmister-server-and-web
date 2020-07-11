import styles from "./titleBar.module.css"
import SearchBar from "./titleBar/searchBar"
import Title from "./titleBar/title"
import Avatar from "./titleBar/avatar"

export default function TitleBar({ title, setFlyoutContent, setFlyoutOpen }) {
    const [signedIn, setSignedIn] = React.useState(false)

    return (
        <div className={styles.titleBar}>
            <SearchBar></SearchBar>
            <Title text={title}></Title>
            <Avatar signedIn={signedIn} setFlyoutContent={setFlyoutContent} setFlyoutOpen={setFlyoutOpen}>Sign In</Avatar>
        </div>
    )
}