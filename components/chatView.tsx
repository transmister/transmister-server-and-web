import styles from './chatView.module.css'

export default function ChatView(props: {
    username: string,
    signedIn: boolean | object,
}) {
    const centerAndGrey = { display: 'grid', placeItems: 'center', color: 'grey', height: '100%' }

    if (props.username) {
        return (
            <div className={styles.chatView}>
                <div className={styles.chatViewTitleBar}>
                    <h1 className={styles.chatViewTitleBarTitle}>{props.username}</h1>
                </div>
                <div className={styles.chatViewMsgs}>
                    {(() => {
                        var items = []
                        for (let i = 0; i < 64; i++) {
                            items.push(<p><p>hello by {props.username}, {i + 1}</p></p>)
                        }
                        return items
                    })()}
                </div>
                <div className={styles.chatViewInputBar}>
                    <textarea className={styles.chatViewInputBarTextArea}></textarea>
                </div>
            </div>
        )
    } else if (props.signedIn) {
        return <div style={centerAndGrey}>Add a contact to get started.</div>
    } else {
        return <div style={centerAndGrey}>Sign up or sign in to get started.</div>
    }
}