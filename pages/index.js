import Head from 'next/head'
import TitleBar from '../components/titleBar'
import MasterDetail from '../components/masterDetail'
import ChatView from '../components/chatView'
import { useState } from 'react'
import io from 'socket.io-client'

var siteTitle = 'Transmister'
var windowTitle = 'Transmister'

export default function Home() {
  const socket = io('/')
  socket.emit('e', 'hello, world')

  var inputVal

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
          </>} />
    </>
  )
}
