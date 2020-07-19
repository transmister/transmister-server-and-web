import styles from './alert.module.css'

function Alert({ type, title, desc }) {
    return <div className={`${styles.alert}`} type={type}>
        <p className={styles.alertTitle}>{title}</p>
        <p className={styles.alertDesc}>{desc}</p>
    </div>
}

export default Alert