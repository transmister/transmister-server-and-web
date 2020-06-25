import Head from 'next/head'
import TitleBar from "../components/titleBar"
import MasterDetail from "../components/masterDetail"

var siteTitle = "Transmister"
var windowTitle = "Transmister"

export default function Home() {
  return (
    <div>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <TitleBar title={windowTitle}></TitleBar>
      <MasterDetail master={[
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
      ]} detail={<div>hello</div>}></MasterDetail>
    </div>
  )
}
