import Head from 'next/head'
import TitleBar from "../components/titleBar"
import MasterDetail from "../components/masterDetail"
import Flyout from '../components/flyout'

var siteTitle = "Transmister"
var windowTitle = "Transmister"

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <TitleBar title={windowTitle}></TitleBar>
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
          detail={<div>detail</div>} />
        <Flyout>
          <h2>helo</h2>
        </Flyout>
      </div>
    )
  }
}

