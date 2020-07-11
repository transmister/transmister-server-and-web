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

function FlyoutContent({ children }) {
    return <div className={styles.flyoutContent}>{children}</div>
}

function FlyoutFooter({ align, children }) {
    return <div className={styles.flyoutFooter} style={{textAlign: align}}>{children}</div>
}

export { Flyout, FlyoutTitle, FlyoutContent, FlyoutFooter }