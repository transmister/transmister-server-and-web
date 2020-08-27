import styles from './tabView.module.css'

/**
 * ### Usage Demo
 *
 * ```js
 * const [tabCurrentIndex, setTabCurrentIndex] = React.useState(0)
var myTabView = <TabView maxIndex={1} setIndex={setTabCurrentIndex} tabBarBuilder={(i, setIndex) => {
    return [
        <Tab index={0} currentIndex={tabCurrentIndex} setIndex={setIndex}>Tab 0</Tab>,
        <Tab index={1} currentIndex={tabCurrentIndex} setIndex={setIndex}>Tab 1</Tab>
    ][i]
}}
    tabPanelBuilder={(i) => {
        return [
            <TabPanel index={0} currentIndex={tabCurrentIndex}>TabPanel 0</TabPanel>,
            <TabPanel index={1} currentIndex={tabCurrentIndex}>TabPanel 1</TabPanel>
        ][i]
    }} />
 * ```
 */
function TabView(props: {
    currentIndex: number,
    setIndex: Function,
    maxIndex: number,
    tabBarBuilder: Function,
    tabPanelBuilder: Function
}) {
    var tmp = {
        tabBar: [],
        tabPanel: []
    }
    for (let i = 0; i <= props.maxIndex; i++) {
        tmp.tabBar.push(props.tabBarBuilder(i, props.setIndex))
        tmp.tabPanel.push(props.tabPanelBuilder(i))
    }

    return <>
        <div className={styles.tabViewTabBar}><Tabs>{tmp.tabBar}</Tabs></div>
        {tmp.tabPanel}
    </>
}

function Tabs(props: {
    children: Array<JSX.Element>
}) {
    return <div className={styles.tabs}>{props.children}</div>
}

function Tab({ index, currentIndex, setIndex, children }) {
    return <button key={index} onClick={() => { setIndex(index) }} className={index == currentIndex ? `${styles.tab} ${styles.tabActive}` : `${styles.tab}`}>{children}</button>
}

function TabPanel({ index, currentIndex, children }) {
    return (index == currentIndex ? <div key={index}>{children}</div> : null)
}

export { TabView, Tabs, Tab, TabPanel }