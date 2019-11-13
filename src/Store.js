import React from 'react'
import io from 'socket.io-client'

export const CTX = React.createContext()

export const RECEIVE_MESSAGE = "RECEIVE_MESSAGE"

const initState = {
  'Channel One': [
    { from: 'will', msg: 'hello'}, 
    { from: 'emilio', msg: 'hello'}, 
    { from: 'rob', msg: 'hello'}
  ],
  'Channel Two': [
    { from: 'will', msg: 'hello'}, 
    { from: 'will', msg: 'hello'}, 
    { from: 'will', msg: 'hello'}
    ]
}

const reducer = (state, action) => {
  const { from, msg, topic } = action.payload
  switch(action.type){
    case RECEIVE_MESSAGE:
    return {
        ...state,
        [topic]: [...state[topic], { from, msg }]
    }
    default:
      return state
  }
}

let socket 

function sendChat(value) {
    socket.emit('chat message', value)
}

const user = 'will' + Math.random(100).toFixed(2)

export default function Store(props) {

  const [allChats, dispatch ] = React.useReducer(reducer, initState)

  if (!socket) {
    socket = io(':3001')
    socket.on('chat message', function(msg){
      dispatch({ type: RECEIVE_MESSAGE, payload: msg})
    })
  }

  

  return (
    <CTX.Provider value={{allChats, sendChat, user}}>
      {props.children}
    </CTX.Provider>
  )
}