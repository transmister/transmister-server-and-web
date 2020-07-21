import styles from './menu.module.css'

function Menu(props?: {
    items: Array<any>
}) {
    var tmp = []
    for (const i in props.items) {
        var item = props.items[i]
        tmp.push(
            <button className={styles.menuItem} onClick={item.onClick ? item.onClick : null}>{item.text}</button>
        )
    }
    return <div className={styles.menu}>{tmp}</div>
}

export default Menu