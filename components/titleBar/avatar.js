import styles from './avatar.module.css'
import Button from '../button'
import SignInOrSignUp from '../signInOrSignUp'
import { FlyoutTitle, FlyoutContent, FlyoutFooter } from '../flyout'
import { globalVariables } from '../../global/global'

function Avatar({ signedIn, setFlyoutContent, setFlyoutOpen }) {
    return (signedIn ? <></> :
        <Button className={`${styles.avatar} ${styles.avatarSignedInFalse}`} onClick={() => {
            setFlyoutContent(<>
                <FlyoutTitle title={`Sign in or sign up to ${globalVariables.prodName}`} showCloseButton={true} closeFlyout={setFlyoutOpen} />
                <FlyoutContent>
                    <SignInOrSignUp setFlyoutOpen={setFlyoutOpen} />
                </FlyoutContent>
                <FlyoutFooter align='right'>
                    <Button onClick={() => {
                        setFlyoutOpen(false)
                    }}>Cancel</Button>
                </FlyoutFooter>
            </>)
            setFlyoutOpen(true)
        }}>Sign Up</Button>
    )
}

export default Avatar