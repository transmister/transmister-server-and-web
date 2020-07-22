import { TabView, Tabs, Tab, TabPanel } from './tabView'
import TextField from './textField'
import Button from './button'
import signInOrUp from '../socket/actions/userAction'
import AlertGroup from './alertGroup'

var userData = {
    username: undefined,
    password: undefined
}

function SignInOrSignUp({ setFlyoutOpen, setSignedIn }) {
    const [currentTabIndex, setCurrentTabIndex] = React.useState(0)
    const [signUpErrors, setSignUpErrors] = React.useState([])

    return <TabView tabBar={<Tabs>
        <Tab index={0} currentIndex={currentTabIndex} setIndex={setCurrentTabIndex}>Sign Up</Tab>
        <Tab index={1} currentIndex={currentTabIndex} setIndex={setCurrentTabIndex}>Sign In</Tab>
    </Tabs>
    } tabPanel={<>
        <TabPanel >
            <TextField value={userData.username} placeholder='Username' type='text' fluid={true} onChange={(e) => {
                userData.username = e.target.value
            }} />
            <TextField value={userData.password} placeholder='Password' type='password' fluid={true} onChange={(e) => {
                userData.password = e.target.value
            }} />
            <AlertGroup alerts={signUpErrors} />
            <div style={{ textAlign: 'right' }}>
                <Button onClick={() => {
                    if(!userData.username || !userData.password) return
                    signInOrUp(currentTabIndex == 0 ? 'signUp' : 'signIn', userData, data => {
                        switch (data.event) {
                            case 'error':
                                if(data.data.errId == 'signUp.usernameIsTaken'){
                                    setSignUpErrors([{
                                        type: 'error',
                                        title: 'Username is already taken',
                                        desc: 'Your username is already taken by others, you need to change one.',
                                    }])
                                } else if (data.data.errId == 'signIn.failed'){
                                    setSignUpErrors([{
                                        type: 'error',
                                        title: 'Username or Password is failed',
                                        desc: 'You may have forgotten your username or password.',
                                    }])
                                }
                                break;
                        
                            default:
                                // 登录或者注册成功
                                setSignedIn({
                                    username: userData.username
                                })
                                setFlyoutOpen(false)
                                break;
                        }
                    })
                }}>{currentTabIndex == 0 ? 'Sign Up' : 'Sign In'}</Button>
            </div>
        </TabPanel>
    </>} />
}

export default SignInOrSignUp