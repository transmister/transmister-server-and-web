import { TabView, Tabs, Tab, TabPanel } from '../components/tabView'
import TextField from './textField'
import Button from './button'
import signInOrUp from '../socket/actions/signInOrUp'

var data = {
    signUp: {
        username: undefined,
        password: undefined
    },
    signIn: {
        username: undefined,
        password: undefined
    }
}

function SignInOrSignUp({ setFlyoutOpen }) {
    const [currentTabIndex, setCurrentTabIndex] = React.useState(0)

    return <TabView tabBar={<Tabs>
        <Tab index={0} currentIndex={currentTabIndex} setIndex={setCurrentTabIndex}>Sign Up</Tab>
        <Tab index={1} currentIndex={currentTabIndex} setIndex={setCurrentTabIndex}>Sign In</Tab>
    </Tabs>
    } tabPanel={<>
        <TabPanel index={0} currentIndex={currentTabIndex}>
            <TextField value={data.signUp.username} placeholder='Username' type='username' fluid={true} onChange={(e) => {
                data.signUp.username = e.target.value
            }} />
            <TextField value={data.signUp.password} placeholder='Password' type='password' fluid={true} onChange={(e) => {
                data.signUp.password = e.target.value
            }} />
            <div style={{ textAlign: 'right' }}>
                <Button onClick={() => {
                    signInOrUp('signUp', data.signUp.username, data.signUp.password, () => { setFlyoutOpen(false) })
                }}>Sign Up</Button>
            </div>
        </TabPanel>
        <TabPanel index={1} currentIndex={currentTabIndex}>
            <TextField value={data.signIn.username} placeholder='Username' type='username' fluid={true} onChange={(e) => {
                data.signIn.username = e.target.value
            }} />
            <TextField value={data.signIn.password} placeholder='Password' type='password' fluid={true} onChange={(e) => {
                data.signIn.password = e.target.value
            }} />
            <div style={{ textAlign: 'right' }}>
                <Button onClick={() => {
                    signInOrUp('signIn', data.signIn.username, data.signIn.password, () => { setFlyoutOpen(false) })
                }}>Sign In</Button>
            </div>
        </TabPanel>
    </>} />
}

export default SignInOrSignUp