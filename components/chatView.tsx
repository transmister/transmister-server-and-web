import styles from './chatView.module.css'
import { msgMgr, msgMgrEvents } from '../messages/manager'

export default function ChatView(props: {
    username: string,
    signedIn: boolean | object,
}) {
    const centerAndGrey = { display: 'grid', placeItems: 'center', color: 'grey', height: '100%' }

    const [msgs, setMsgs] = React.useState(msgMgr.get(props.username))
    msgMgrEvents.on('add', (username) => {
        if (username == props.username) {
            setMsgs(msgMgr.get(props.username))
        }
    })

    if (props.username) {
        return (
            <div className={styles.chatView}>
                <div className={styles.chatViewTitleBar}>
                    <h1 className={styles.chatViewTitleBarTitle}>{props.username}</h1>
                </div>
                <div className={styles.chatViewMsgs}>
                    {(() => {
                        var msgList = []
                        msgs.forEach(element => {
                            msgList.push(<p>{JSON.stringify(element)}</p>)
                        });
                        return ""
                    })()}
                </div>
                <div className={styles.chatViewInputBar}>
                    <textarea className={styles.chatViewInputBarTextArea} onKeyDown={(ev) => {

                    }}></textarea>
                </div>
            </div>
        )
    } else if (props.signedIn) {
        return <div style={centerAndGrey}>Add a contact to get started.</div>
    } else {
        return <div style={centerAndGrey}>Sign up or sign in to get started.</div>
    }
}