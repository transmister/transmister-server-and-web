import styles from "./master.module.css"

var $data = [
    {
        title: "A",
        description: "UI Test A"
    },
    {
        title: "B",
        description: "UI Test B"
    },
    {
        title: "C",
        description: "UI Test C"
    },
]

export default function Master(props) {
    return (
        <div className={styles.master}>{(function (data) {
            var tmp = new Array()
            for (const index in $data) {
                tmp.push(<h3>{$data.title}</h3>)
            }
            return <div>{tmp}</div>
        })(props.data)}</div>
    )
}