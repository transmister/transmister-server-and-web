import styles from "./master.module.css"

export default function Master(props) {
    return (
        <div className={styles.master}>
            {(function () {
                var tmp = new Array()
                for (const i in props.data) {
                    tmp.push(
                        <div className={styles.listItem} key={props.data[i].key}>
                            <p className={styles.listItemTitle}>{props.data[i].title}</p>
                            <p className={styles.listItemDescription}>{props.data[i].description}</p>
                        </div>
                    )
                }

                return tmp
            })()}
        </div>
    )
}