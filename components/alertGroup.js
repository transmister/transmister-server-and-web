import styles from './alertGroup.module.css'
import Alert from './alert'

function AlertGroup({ alerts }) {
    return <>
        {
            (function () {
                var tmp = new Array()
                for (const i in alerts) {
                    tmp.push(
                        <Alert
                            type={alerts[i].type}
                            title={alerts[i].title}
                            desc={alerts[i].desc}
                        />
                    )
                }

                return tmp
            })()
        }
    </>
}

export default AlertGroup