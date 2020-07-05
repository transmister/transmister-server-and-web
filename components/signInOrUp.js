import PropTypes from 'prop-types';
import {
    Tabs,
    Tab,
    TextField,
    Button,
    DialogActions,
    DialogContent,
} from '@material-ui/core'

import { useState } from 'react'
import socket from '../socket/socket'

export default function SignInOrUp({ handleClose }) {

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <>{children}</>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    var data = {
        signIn: {
            username: undefined,
            password: undefined
        },
        signUp: {
            username: undefined,
            password: undefined
        }
    }

    function handleEmit(signInOrUp, username, password) {
        var tmp;
        // signInOrUp == true  => sign in
        //            == false => sign up
        if (signInOrUp) {
            tmp = "signIn"
        } else {
            tmp = "signUp"
        }
        socket.emit("e", {
            event: tmp,
            data: {
                username: username,
                password: password
            }
        })
        handleClose()
    }

    return (
        <>
            <DialogContent>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="Sign in or sign up"
                >
                    <Tab label="Sign In" {...a11yProps(0)} />
                    <Tab label="Sign Up" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <TextField
                        label="Username"
                        type="text"
                        autoComplete="current-username"
                        required={true}
                        value={data.signIn.username}
                        onChange={(e) => {
                            data.signIn.username = e.target.value
                        }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        required={true}
                        value={data.signIn.password}
                        onChange={(e) => {
                            data.signIn.password = e.target.value
                        }}
                    />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <TextField
                        label="Username"
                        type="text"
                        autoComplete="current-username"
                        required={true}
                        value={data.signUp.username}
                        onChange={(e) => {
                            data.signUp.username = e.target.value
                        }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        required={true}
                        value={data.signUp.password}
                        onChange={(e) => {
                            data.signUp.password = e.target.value
                        }}
                    />
                </TabPanel>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={() => {
                    var tmp
                    if (!value) {
                        tmp = data.signIn
                    } else {
                        tmp = data.signUp
                    }
                    handleEmit(!value, tmp.username, tmp.password)
                }} autoFocus>Continue</Button>
            </DialogActions>
        </>
    )
}