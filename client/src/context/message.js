import React, { createContext, useContext, useReducer } from 'react'
import { SET_USERS, SET_USER_MESSAGES, SET_SELECTED_USER, ADD_MESSAGE, ADD_REACTION } from './types'

const MessageStateContext = createContext()
const MessageDispatchContext = createContext()

const initialState = {
    users: null
}

const messageReducer = (state, action) => {
    
    const { username, message, messages, reaction } = action.payload
    let usersCopy, userIndex
    
    switch (action.type) {
        case SET_USERS:
            return {
                ...state,
                users: action.payload
            }
        case SET_USER_MESSAGES:
            usersCopy = [...state.users]
            userIndex = usersCopy.findIndex((user) => user.username === username)
            usersCopy[userIndex] = { ...usersCopy[userIndex], messages }
            return {
                ...state,
                users: usersCopy
            }
        case SET_SELECTED_USER:
            usersCopy = state.users.map((user) => ({
                ...user,
                isSelected: user.username === action.payload
            }))
            return {
                ...state,
                users: usersCopy
            }
        case ADD_MESSAGE:
            usersCopy = [...state.users]
            userIndex = usersCopy.findIndex((user) => user.username === username)
            message.reactions = []
            let newUser = {
                ...usersCopy[userIndex],
                messages: usersCopy[userIndex].messages ? [message, ...usersCopy[userIndex].messages] : null,
                latestMessage: message
            }
            usersCopy[userIndex] = newUser
            return {
                ...state,
                users: usersCopy
            }
        case ADD_REACTION:
            usersCopy = [...state.users]
            userIndex = usersCopy.findIndex((user) => user.username === username)
            // make a copy of the user
            let userCopy = { ...usersCopy[userIndex] }
            // find the index of the message that it pertains to
            const messageIndex = userCopy.messages?.findIndex((message) => message.uuid === reaction.message.uuid)
            if (messageIndex > -1) {
                // make a copy of user messages
                let messagesCopy = [ ...userCopy.messages ]
                // make a copy of user message reactions
                let reactionsCopy = [ ...messagesCopy[messageIndex].reactions ]
                const reactionIndex = reactionsCopy.findIndex((r) => r.uuid === reaction.uuid)
                if (reactionIndex > -1) {
                    // reaction exists, update it
                    reactionsCopy[reactionIndex] = reaction
                } else {
                    // new reaction, add it
                    reactionsCopy = [ ...reactionsCopy, reaction ]
                }
                messagesCopy[messageIndex] = {
                    ...messagesCopy[messageIndex],
                    reactions: reactionsCopy
                }
                userCopy = { ...userCopy, messages: messagesCopy }
                usersCopy[userIndex] = userCopy
            }
            return {
                ...state,
                users: usersCopy
            }
        default:
            return state
    }
}

export const MessageProvider = (props) => {
    
    const [state, dispatch] = useReducer(messageReducer, initialState)
    
    return (
        <MessageDispatchContext.Provider value={dispatch}>
            <MessageStateContext.Provider value={state}>
                {props.children}
            </MessageStateContext.Provider>
        </MessageDispatchContext.Provider>
    )
}

export const useMessageState = () => useContext(MessageStateContext)
export const useMessageDispatch = () => useContext(MessageDispatchContext)