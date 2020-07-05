import Head from 'next/head'
import TitleBar from '../components/titleBar'
import MasterDetail from '../components/masterDetail'
import ChatView from '../components/chatView'
import SignInOrUp from '../components/signInOrUp'
import { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import socket from '../socket/socket'

var siteTitle = 'Transmister'
var windowTitle = 'Transmister'

export default function Home() {
  var inputVal

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
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
        detail={
          <>
            <ChatView />
            <input value={inputVal} onChange={(e) => {
              inputVal = e.target.value
            }} />
            <button onClick={function () {
              if (inputVal) {
                socket.emit('connectUsername', inputVal)
              } else {
                alert("invalid username")
              }
            }}>Send msg to server</button>
            <Button onClick={handleClickOpen}>Open alert dialog</Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Sign In or Sign Up to Transmister"}</DialogTitle>
              <SignInOrUp handleClose={handleClose} />
            </Dialog>
          </>} />
    </>
  )
}
