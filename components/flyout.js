import styles from './flyout.module.css'

function Flyout({ open, children }) {
    return (
        open ? <div className={styles.flyout}>{children}</div> : null
    )
}

function FlyoutTitle({ leading, title, showCloseButton, closeFlyout }) {
    return <div className={styles.title}>
        {leading ? <p className={styles.titleLeading}>{leading}</p> : null}
        {title ? <p className={styles.titleTitle}>{title}</p> : null}
        {showCloseButton ? <button className={styles.titleCloseBtn} onClick={() => {closeFlyout(false)}}>&times;</button> : null}
    </div>
}

export { Flyout, FlyoutTitle }