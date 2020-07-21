import styles from './avatar.module.css'
import Button from '../button'
import SignInOrSignUp from '../signInOrSignUp'
import { FlyoutTitle, FlyoutContent, FlyoutFooter } from '../flyout'
import Menu from '../menu'
import { globalVariables } from '../../global/global'

function Avatar({ signedIn, setSignedIn, setFlyoutContent, setFlyoutOpen }) {
    if (signedIn) {
        return (<div className={`${styles.avatar} ${styles.avatarSignedInTrue}`}>
            <p>{signedIn.username}</p>
            <button className={styles.avatarSignedInTrueMoreButton}>
                <i class="ri-arrow-down-s-line"></i>
            </button>
            <div className={styles.avatarSignedInTrueMoreDropDownMenu}>
                <Menu items={[
                    { text: 'Settings', onClick: (e) => { } },
                    { text: 'Sign Out', onClick: (e) => { } },
                ]} />
            </div>
        </div>)
    } else {
        return (<Button className={`${styles.avatar} ${styles.avatarSignedInFalse}`} onClick={() => {
            setFlyoutContent(<>
                <FlyoutTitle title={`Sign in or sign up to ${globalVariables.prodName}`} showCloseButton={true} closeFlyout={setFlyoutOpen} />
                <FlyoutContent>
                    <SignInOrSignUp setFlyoutOpen={setFlyoutOpen} setSignedIn={setSignedIn} />
                </FlyoutContent>
                <FlyoutFooter align='right'>
                    <Button onClick={() => {
                        setFlyoutOpen(false)
                    }}>Cancel</Button>
                </FlyoutFooter>
            </>)
            setFlyoutOpen(true)
        }}>Sign Up</Button>)
    }
}

export default Avatar