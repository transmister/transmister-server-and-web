import styles from './textField.module.css'

function TextField({ value, placeholder, type, onChange, className, fluid }) {
    fluid = fluid ? styles.textFieldFluid : ''

    return <input value={value} placeholder={placeholder} type={type} onChange={onChange} className={`${styles.textField} ${fluid} ${className}`} />
}

export default TextField