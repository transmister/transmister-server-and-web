import styles from "./master.module.css"

// var testData = [
//     {
//         title: "A",
//         description: "UI Test A"
//     },
//     {
//         title: "B",
//         description: "UI Test B"
//     },
//     {
//         title: "C",
//         description: "UI Test C"
//     },
// ]

export default function Master(props) {
    return (
        <div className={styles.master}>
            {(function () {
                var tmp = new Array()
                for (const i in props.data) {
                    tmp.push(<div className={styles.listItem}>
                        <p className={styles.listItemTitle}>{props.data[i].title}</p>
                        <p className={styles.listItemDescription}>{props.data[i].description}</p>
                    </div>)
                }

                return tmp
            })()}
        </div>
    )
}