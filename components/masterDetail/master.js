import styles from "./master.module.css"

export default function Master(props) {
    var items = []
    for (const i in props.data) {
        items.push(
            <div className={styles.listItem} key={props.data[i].key}>
                <p className={styles.listItemTitle}>{props.data[i].title}</p>
                <p className={styles.listItemDescription}>{props.data[i].description}</p>
            </div>
        )
    }

    return (
        <div className={styles.master}>
            {items}
        </div>
    )
}