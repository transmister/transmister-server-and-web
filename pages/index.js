import Head from 'next/head'
import TitleBar from '../components/titleBar'
import MasterDetail from '../components/masterDetail'
import ChatView from '../components/chatView'
import Flyout from '../components/flyout'
import globalVariables from '../global/global'

export default function Home() {

  const [flyoutOpen, setFlyoutOpen] = React.useState(false)
  const [flyoutContent, setFlyoutContent] = React.useState(<></>)
  const [signedIn, setSignedIn] = React.useState(false)
  const [master, setMaster] = React.useState([])

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
      />
      <MasterDetail
        master={master}
        detail={
          <>
            <ChatView />
          </>} />
      <Flyout open={flyoutOpen} setFlyoutOpen={setFlyoutOpen}>
        {flyoutContent}
      </Flyout>
    </>
  )
}