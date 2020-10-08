import styles from "./master.module.css"

export default function Master(props) {
    var items = []
    props.data.forEach((value) => {
        items.push(
            <div
                className={styles.listItem}
                key={value.key}
                onClick={(ev) => { value.onClick(ev) }}>
                <p className={styles.listItemTitle}>{value.title}</p>
                <p className={styles.listItemDescription}>{value.description}</p>
            </div>
        )
    })

    return (
        <div className={styles.master}>
            {items}
        </div>
    )
}