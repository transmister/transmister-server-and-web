import styles from "./title.module.css"

export default function Title(props) {
    return (
        <h4 className={styles.title}>{props.text}</h4>
    )
}