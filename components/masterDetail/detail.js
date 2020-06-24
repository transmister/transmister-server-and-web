import styles from "./detail.module.css"

export default function Detail({ children }, props) {
    return (
        <div className={styles.detail}>{children}</div>
    )
}