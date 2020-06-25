import styles from "./masterDetail.module.css"
import Master from "./masterDetail/master"
import Detail from "./masterDetail/detail"

export default function MasterDetail(props) {
    return (
        <div className={styles.masterDetail}>
            <Master data={props.master}></Master>
            <Detail>{props.detail}</Detail>
        </div>
    )
}