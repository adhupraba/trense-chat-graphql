import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { useMutation } from '@apollo/client'

import { SEND_MESSAGE_MUTATION } from '../graphql/mutations'
import { useMessageState } from '../context/message'

const MessageInput = () => {
    
    const [content, setContent] = useState('')
    
    const { users } = useMessageState()
    
    const selectedUser = users?.find((user) => user.isSelected === true)
    
    const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION, {
        onError: (err) => {
            console.log(err)
        }
    })
    
    const onSubmitHandler = (e) => {
        e.preventDefault()
        if (content.trim() === '') {
            return
        }
        setContent('')
        sendMessage({ variables: {to: selectedUser.username, content} })
    }
    
    return (
        <div className='px-3 py-2'>
            <Form onSubmit={onSubmitHandler}>
                <Form.Group className='d-flex align-items-center m-0'>
                    <Form.Control 
                        type='text'
                        className='message-input rounded-pill bg-secondary border-0'
                        placeholder='Type a message...'
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <i 
                        className='fas fa-paper-plane fa-2x text-primary ml-2'
                        style={{ cursor: 'pointer' }} 
                        onClick={onSubmitHandler}
                    >
                    </i>
                </Form.Group>
            </Form>
        </div>
    )
}

export default MessageInput
