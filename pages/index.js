import Head from 'next/head'
import TitleBar from '../components/titleBar'
import MasterDetail from '../components/masterDetail'
import ChatView from '../components/chatView'
import { Flyout, FlyoutTitle, FlyoutContent, FlyoutFooter } from '../components/flyout'
import SignInOrSignUp from '../components/signInOrSignUp'
import Button from '../components/button'
import globalVariables from '../global/global'
import socket from '../socket/socket'
import keyPair from '../encryption/client'

export default function Home() {

  const [flyoutOpen, setFlyoutOpen] = React.useState(false)
  const [flyoutContent, setFlyoutContent] = React.useState(<></>)

  return (
    <>
      <Head>
        <title>{globalVariables.siteName}</title>
      </Head>
      <TitleBar title={globalVariables.appName} setFlyoutContent={setFlyoutContent} setFlyoutOpen={setFlyoutOpen}></TitleBar>
      <MasterDetail
        master={[
          {
            title: "Transmister",
            description: "Welcome to Transmister."
          },
          {
            title: "B",
            description: "hello!"
          },
          {
            title: "C",
            description: "hello!"
          },
        ]}
        detail={
          <>
            <ChatView />
            <Button onClick={() => {
              setFlyoutOpen(!flyoutOpen)
              setFlyoutContent(<>
                <FlyoutTitle title={`Sign in or sign up to ${globalVariables.prodName}`} showCloseButton={true} closeFlyout={setFlyoutOpen} />
                <FlyoutContent>
                  <SignInOrSignUp />
                </FlyoutContent>
                <FlyoutFooter align='right'>
                  <Button onClick={() => {
                    setFlyoutOpen(false)
                  }}>Cancel</Button>
                </FlyoutFooter>
              </>)
            }}>Switch Flyout</Button>
            <Button onClick={() => {
              console.log(keyPair)
            }}>test</Button>
          </>} />
      <Flyout open={flyoutOpen}>
        {flyoutContent}
      </Flyout>
    </>
  )
}