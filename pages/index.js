import Head from 'next/head'
import TitleBar from '../components/titleBar'
import MasterDetail from '../components/masterDetail'
import ChatView from '../components/chatView'
import Flyout from '../components/flyout'
import globalVariables from '../global/global'
import { c2cEncryptionEvents } from '../socket/encryption'

var masterControllerRegistered = false

export default function Home() {

  const [flyoutOpen, setFlyoutOpen] = React.useState(false)
  const [flyoutContent, setFlyoutContent] = React.useState(<></>)
  const [signedIn, setSignedIn] = React.useState(false)
  const [master, setMaster] = React.useState([])
  const [chatViewUsername, setChatViewUsername] = React.useState('nobody')

  if (!masterControllerRegistered) {
    c2cEncryptionEvents.on('update', (e) => {
      console.log('triggered')

      setChatViewUsername(e.username)

      let inMaster = false;
      for (const i in master) {
        let item = master[i]
        if (item.key == e.username) {
          inMaster = true
          break
        }
      }
      if (!inMaster) {
        let newMaster = master
        newMaster.push({
          key: e.username,
          title: e.username,
          description: 'Encryption initialized.'
        })
        setMaster(newMaster)
      }
    })
    masterControllerRegistered = true
  }

  return (
    <>
      <Head>
        <title>{globalVariables.siteName}</title>
        <meta charSet='UTF-8'></meta>
      </Head>
      <TitleBar
        title={globalVariables.appName}
        setFlyoutContent={setFlyoutContent}
        setFlyoutOpen={setFlyoutOpen}
        signedIn={signedIn}
        setSignedIn={setSignedIn}
        master={master}
        setMaster={setMaster}
      />
      <MasterDetail
        master={master}
        detail={<>
          <ChatView username={chatViewUsername} />
        </>}
      />
      <Flyout open={flyoutOpen} setFlyoutOpen={setFlyoutOpen}>
        {flyoutContent}
      </Flyout>
    </>
  )
}