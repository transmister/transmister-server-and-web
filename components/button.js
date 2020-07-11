import styles from './button.module.css'

function Button({ onClick, className, children }) {
    return <button onClick={onClick} className={`${styles.button} ${className}`}>{children}</button>
}

export default Button