import { TabView, Tabs, Tab, TabPanel } from '../components/tabView'
import TextField from './textField'
import Button from './button'
import signInOrUp from '../socket/actions/signInOrUp'
import AlertGroup from '../components/alertGroup'
import encryptedSocket from '../encryption/client'

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
    const [signUpErrors, setSignUpErrors] = React.useState([])

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
            <AlertGroup alerts={signUpErrors} />
            <div style={{ textAlign: 'right' }}>
                <Button onClick={() => {
                    // socketErrorFixHandler.reg('signUp.isTaken', () => {
                    //     setSignUpErrors(signUpErrors.push({
                    //         type: 'error',
                    //         title: 'Username is already taken',
                    //         desc: 'Your username is already taken by others, you need to change one.',
                    //     }))
                    // })
                    encryptedSocket.on('e', (data) => {
                        if (data.event == 'error' && data.data.errId == 'signUp.isTaken') {
                            setSignUpErrors([{
                                type: 'error',
                                title: 'Username is already taken',
                                desc: 'Your username is already taken by others, you need to change one.',
                            }])
                        } else if (data.event == 'success' && data.data.successId == 'signUp.success') {
                            console.log('ssss')
                            setFlyoutOpen(false)
                        }
                    })
                    signInOrUp('signUp', data.signUp.username, data.signUp.password)
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