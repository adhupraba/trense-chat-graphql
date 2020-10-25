import React, { Fragment, useEffect } from 'react'
import { Row } from 'react-bootstrap'
import { useSubscription } from '@apollo/client'

import Users from '../components/Users'
import NavBar from '../components/NavBar'
import Messages from '../components/Messages'
import { NEW_MESSAGE_SUBSCRIPTION, NEW_REACTION_SUBSCRIPTION } from '../graphql/subscriptions'
import { useAuthState } from '../context/auth'
import { useMessageDispatch } from '../context/message'
import { ADD_MESSAGE, ADD_REACTION } from '../context/types'

const Home = () => {
    
    const { user } = useAuthState()
    const messageDispatch = useMessageDispatch()
    
    const { data: messageData, error: messageError } = useSubscription(NEW_MESSAGE_SUBSCRIPTION)
    const { data: reactionData, error: reactionError } = useSubscription(NEW_REACTION_SUBSCRIPTION)
    
    useEffect(() => {
        if (messageError) {
            console.log(messageError)
        }
        if (messageData) {
            
            const message = messageData.newMessage
            const otherUser = user.username === message.to ? message.from : message.to
            
            messageDispatch({
                type: ADD_MESSAGE,
                payload: {
                    username: otherUser,
                    message
                }
            })
        }
    }, [messageError, messageData, messageDispatch, user])
    
    useEffect(() => {
        if (reactionError) {
            console.log(reactionError)
        }
        if (reactionData) {
            
            const reaction = reactionData.newReaction
            const otherUser = user.username === reaction.message.to ? reaction.message.from : reaction.message.to
            
            messageDispatch({
                type: ADD_REACTION,
                payload: {
                    username: otherUser,
                    reaction
                }
            })
        }
    }, [reactionError, reactionData, messageDispatch, user])
    
    return (
        <Fragment>
            <NavBar />
            <Row className='bg-white rounded' style={{ overflow: 'hidden' }}>
                <Users />
                <Messages />
            </Row>
        </Fragment>
    )
}

export default Home
