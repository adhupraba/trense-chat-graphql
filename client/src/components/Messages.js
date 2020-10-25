import React, { useEffect, Fragment } from 'react'
import { Col } from 'react-bootstrap'
import { useLazyQuery } from '@apollo/client'

import { GET_MESSAGES_QUERY } from '../graphql/queries'
import { useMessageDispatch, useMessageState } from '../context/message'
import { SET_USER_MESSAGES } from '../context/types'
import MessageItem from '../ui/MessageItem'
import MessageInput from '../ui/MessageInput'

const Messages = () => {
    
    const { users } = useMessageState()
    const dispatch = useMessageDispatch()
    // users?.find((user) => user.isSelected === true)
    // this means that if the users array exists then it will find()....
    // else it will be undefined
    const selectedUser = users?.find((user) => user.isSelected === true)
    const messages = selectedUser?.messages
    
    const [getMessages, { loading , data }] = useLazyQuery(GET_MESSAGES_QUERY)
    
    useEffect(() => {
        if (selectedUser && !selectedUser.messages) {
            getMessages({ variables: { from: selectedUser.username } })
        }
    }, [selectedUser, getMessages])
    
    useEffect(() => {
        if (data) {
            dispatch({
                type: SET_USER_MESSAGES,
                payload: {
                    username: selectedUser.username,
                    messages: data.getMessages
                }
            })
        }
    }, [data, dispatch])
    
    if (loading) {
        return ( <p>Loading....</p> )
    }
    
    let selectedChatMarkup
    
    if (!messages && !loading) {
        selectedChatMarkup = ( <p className='info-text'>Select a friend</p> )
    } else if (loading) {
        selectedChatMarkup = ( <p className='info-text'>Loading.....</p> )
    } else if (messages.length === 0) {
        selectedChatMarkup = ( <p className='info-text'>You are now connected. Send your first message!</p> )
    } else if (messages.length > 0) {
        selectedChatMarkup = messages.map((message, index) => {
            return (
                <Fragment key={message.uuid}>
                    <MessageItem message={message} />
                    { 
                        index === messages.length - 1 && (
                            <div className='invisible'>
                                <hr className='m-0' />
                            </div>
                        )
                    }
                </Fragment>
            )
        })
    }
    
    return (
        <Col xs={10} md={8} className='bg-dark p-0'>
            <div className='messages-box d-flex flex-column-reverse p-3'>
                { selectedChatMarkup }
            </div>
            {  selectedUser && <MessageInput /> }
        </Col>
    )
}

export default Messages
