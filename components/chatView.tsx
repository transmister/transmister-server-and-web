import styles from './chatView.module.css'

export default function ChatView(props: {
    username?: string
}) {
    return (<div className={styles.chatView}>
        <div className={styles.chatViewTitleBar}>
            <h1 className={styles.chatViewTitleBarTitle}>{props.username}</h1>
        </div>
        <div className={styles.chatViewMsgs}>
            {(() => {
                var items = []
                for (let i = 0; i < 64; i++) {
                    items.push(<p><p>hello, {i}</p></p>)
                }
                return items
            })()}
        </div>
        <div className={styles.chatViewInputBar}>
            <textarea className={styles.chatViewInputBarTextArea}></textarea>
        </div>
    </div>)
}