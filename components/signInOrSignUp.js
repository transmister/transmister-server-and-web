import { TabView, Tabs, Tab, TabPanel } from '../components/tabView'
import TextField from './textField'
import Button from './button'
import signInOrUp from '../socket/actions/signInOrUp'
import AlertGroup from '../components/alertGroup'
import encryptedSocket from '../socket/encryption'

var signInOrSignUpInputData = {
    signUp: {
        username: undefined,
        password: undefined
    },
    signIn: {
        username: undefined,
        password: undefined
    }
}

function SignInOrSignUp({ setFlyoutOpen, setSignedIn }) {
    const [currentTabIndex, setCurrentTabIndex] = React.useState(0)
    const [signUpErrors, setSignUpErrors] = React.useState([])

    return <TabView tabBar={<Tabs>
        <Tab index={0} currentIndex={currentTabIndex} setIndex={setCurrentTabIndex}>Sign Up</Tab>
        <Tab index={1} currentIndex={currentTabIndex} setIndex={setCurrentTabIndex}>Sign In</Tab>
    </Tabs>
    } tabPanel={<>
        <TabPanel index={0} currentIndex={currentTabIndex}>
            <TextField value={signInOrSignUpInputData.signUp.username} placeholder='Username' type='username' fluid={true} onChange={(e) => {
                signInOrSignUpInputData.signUp.username = e.target.value
            }} />
            <TextField value={signInOrSignUpInputData.signUp.password} placeholder='Password' type='password' fluid={true} onChange={(e) => {
                signInOrSignUpInputData.signUp.password = e.target.value
            }} />
            <AlertGroup alerts={signUpErrors} />
            <div style={{ textAlign: 'right' }}>
                <Button onClick={() => {
                    signInOrUp('signUp', signInOrSignUpInputData.signUp.username, signInOrSignUpInputData.signUp.password, (data) => {
                        if (data.event == 'error' && data.data.errId == 'signUp.usernameIsTaken') {
                            setSignUpErrors([{
                                type: 'error',
                                title: 'Username is already taken',
                                desc: 'Your username is already taken by others, you need to change one.',
                            }])
                        } else if (data.event == 'success' && data.data.successId == 'signUp.success') {
                            signInOrUp('signIn', signInOrSignUpInputData.signUp.username, signInOrSignUpInputData.signUp.password, (data) => {
                                setSignedIn({
                                    username: signInOrSignUpInputData.signUp.username
                                })
                            })
                            setFlyoutOpen(false)
                        }
                    })
                }}>Sign Up</Button>
            </div>
        </TabPanel>
        <TabPanel index={1} currentIndex={currentTabIndex}>
            <TextField value={signInOrSignUpInputData.signIn.username} placeholder='Username' type='username' fluid={true} onChange={(e) => {
                signInOrSignUpInputData.signIn.username = e.target.value
            }} />
            <TextField value={signInOrSignUpInputData.signIn.password} placeholder='Password' type='password' fluid={true} onChange={(e) => {
                signInOrSignUpInputData.signIn.password = e.target.value
            }} />
            <div style={{ textAlign: 'right' }}>
                <Button onClick={() => {
                    signInOrUp('signIn', signInOrSignUpInputData.signIn.username, signInOrSignUpInputData.signIn.password, () => { setFlyoutOpen(false) })
                }}>Sign In</Button>
            </div>
        </TabPanel>
    </>} />
}

export default SignInOrSignUp