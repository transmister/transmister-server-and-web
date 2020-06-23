import Head from 'next/head'
import TitleBar from "../components/titleBar"
import MasterDetail from "../components/masterDetail"

var siteTitle = "CONV."
var windowTitle = "CONV."

export default function Home() {
  return (
    <div>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <TitleBar title={windowTitle}></TitleBar>
      <MasterDetail master="abc"></MasterDetail>
    </div>
  )
}
