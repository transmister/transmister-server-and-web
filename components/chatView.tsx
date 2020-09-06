import styles from './chatView.module.css'

export default function ChatView(props: {
    username?: string
}) {
    return (
        <div>ChatView: {props.username}</div>
    )
}