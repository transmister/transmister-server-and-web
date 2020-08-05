import styles from './button.module.css'

function Button({ onClick, className, disabled, style, children }) {
    return <button onClick={onClick} className={`${styles.button} ${className}`} disabled={disabled} style={style}>{children}</button>
}

export default Button