import styles from './tabView.module.css'

function TabView({ tabBar, tabPanel }) {
    return <div>
        <div className={styles.tabViewTabBar}>{tabBar}</div>
        {tabPanel}
    </div>
}

function Tabs({ children }) {
    return <div className={styles.tabs}>{children}</div>
}

function Tab({ index, currentIndex, setIndex, children }) {
    return <button onClick={() => { setIndex(index) }} className={index == currentIndex ? `${styles.tab} ${styles.tabActive}` : `${styles.tab}`}>{children}</button>
}

function TabPanel({ index, currentIndex, children }) {
    return (index == currentIndex ? <div>{children}</div> : null)
}

export { TabView, Tabs, Tab, TabPanel }