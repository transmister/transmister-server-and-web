import { TabView, Tabs, Tab, TabPanel } from './tabView'
import TextField from './textField'
import Button from './button'
import encryptedSocket from '../socket/encryption'
import AlertGroup from './alertGroup'
import Alert from './alert'

var inputData = {
    username: undefined,
    password: undefined
}

function SignInOrSignUp({ setFlyoutOpen, setSignedIn }) {
    const [currentTabIndex, setCurrentTabIndex] = React.useState(0)
    const [signInOrSignUpErrors, setSignInOrSignUpErrors] = React.useState([])

    return <TabView
        currentIndex={currentTabIndex}
        setIndex={setCurrentTabIndex}
        maxIndex={1}
        tabBarBuilder={(i, setIndex) => {
            return [
                <Tab index={0} currentIndex={currentTabIndex} setIndex={setIndex}>Sign Up</Tab>,
                <Tab index={1} currentIndex={currentTabIndex} setIndex={setIndex}>Sign In</Tab>
            ][i]
        }}
        tabPanelBuilder={(i) => {
            return <TabPanel index={i} currentIndex={currentTabIndex}>
                <TextField value={inputData.username} placeholder='Username' type='text' fluid={true} onChange={(e) => {
                    inputData.username = e.target.value
                }} />
                <TextField value={inputData.password} placeholder='Password' type='password' fluid={true} onChange={(e) => {
                    inputData.password = e.target.value
                }} />
                <AlertGroup alerts={signInOrSignUpErrors} />
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={() => {
                        if (inputData.username && inputData.password) {
                            if (i == 0) {
                                encryptedSocket.on('e', (data) => {
                                    if (data.event == 'success' && data.data.successId == 'signUp.success') {
                                        setFlyoutOpen(false)
                                        setSignedIn({ username: inputData.username })
                                    } else if (data.event == 'error' && data.data.errId == 'signUp.usernameIsTaken') {
                                        setSignInOrSignUpErrors([{
                                            type: 'error',
                                            title: 'Sign Up Failed - Username is already taken',
                                            desc: 'The username is already taken by others. Please change one.'
                                        }])
                                    }
                                })
                            }

                            if (i == 1) {
                                encryptedSocket.on('e', (data) => {
                                    if (data.event == 'success' && data.data.successId == 'signIn.success') {
                                        setFlyoutOpen(false)
                                        setSignedIn({ username: inputData.username })
                                    } else if (data.event == 'error' && data.data.errId == 'signIn.incorrectUsernameOrPassword') {
                                        setSignInOrSignUpErrors([{
                                            type: 'error',
                                            title: 'Sign In Failed - Incorrect username or password',
                                            desc: 'You entered incorrect username or password.'
                                        }])
                                        // After showing the alert, user cannot edit the username or password, I don't know why!
                                    }
                                })
                            }

                            encryptedSocket.emit('e', {
                                event: (i == 0 ? 'signUp' : 'signIn'),
                                data: {
                                    username: inputData.username,
                                    password: inputData.password
                                }
                            })
                        }
                    }}>{i == 0 ? 'Sign Up' : 'Sign In'}</Button>
                </div>
            </TabPanel>
        }} />
}

export default SignInOrSignUp