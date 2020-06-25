import styles from './flyout.module.css'

export default class Flyout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            data: this.props.data
        };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date(),
            data: this.props.data
        });
    }

    render() {
        return (
            <div className={styles.flyout}>
                {this.props.children}
            </div>
        );
    }
}