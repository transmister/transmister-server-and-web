import styles from "./master.module.css"

export default function Master(props) {
    return (
        <div className={styles.master}>
            {(function () {
                var tmp = new Array()
                for (const i in props.data) {
                    tmp.push(
                        // Warning: Each child in a list should have a unique "key" prop.
                        //
                        // Check the render method of `Master`. See https://fb.me/react-warning-keys for more information.
                        //     in div (at master.js:11)
                        //     in Master (at masterDetail.js:8)
                        //     in div (at masterDetail.js:7)
                        //     in MasterDetail (at pages/index.js:23)
                        //     in div (at pages/index.js:18)
                        //     in Home (at _app.js:4)
                        //     in App
                        //     in ErrorBoundary (created by ReactDevOverlay)
                        //     in ReactDevOverlay (created by Container)
                        //     in Container (created by AppContainer)
                        //     in AppContainer
                        //     in Root
                        <div className={styles.listItem}>
                            <p className={styles.listItemTitle}>{props.data[i].title}</p>
                            <p className={styles.listItemDescription}>{props.data[i].description}</p>
                        </div>
                    )
                }

                return tmp
            })()}
        </div>
    )
}