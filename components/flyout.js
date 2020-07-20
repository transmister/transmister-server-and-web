import styles from './flyout.module.css'

function Flyout({ open, children, setFlyoutOpen }) {
    if (open) {
        return (<>
            <div className={styles.flyoutMask} onClick={() => {
                setFlyoutOpen(false)
            }}></div>
            <div className={styles.flyout}>{children}</div>
        </>)

    } else {
        return null
    }
}

function FlyoutTitle({ leading, title, showCloseButton, closeFlyout }) {
    return <div className={styles.title}>
        {leading ? <p className={styles.titleLeading}>{leading}</p> : null}
        {title ? <p className={styles.titleTitle}>{title}</p> : null}
        {showCloseButton ? <button className={styles.titleCloseBtn} onClick={() => { closeFlyout(false) }}>&times;</button> : null}
    </div>
}

function FlyoutContent({ children }) {
    return <div className={styles.flyoutContent}>{children}</div>
}

function FlyoutFooter({ align, children }) {
    return <div className={styles.flyoutFooter} style={{ textAlign: align }}>{children}</div>
}

export default Flyout
export { Flyout, FlyoutTitle, FlyoutContent, FlyoutFooter }