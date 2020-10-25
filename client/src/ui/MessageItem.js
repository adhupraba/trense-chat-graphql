import React, { useState } from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { Button, OverlayTrigger, Popover } from 'react-bootstrap'
import { useMutation } from '@apollo/client'

import { useAuthState } from '../context/auth'
import { REACT_TO_MESSAGE_MUTATION } from '../graphql/mutations'

const MessageItem = ({message}) => {
    
    const { user } = useAuthState()
    // sent = true if we sent that message else false and received = vice-versa
    const sent = message.from === user.username
    // received = true if we received that message else false and sent = vice-versa
    const received = !sent
    
    const [showPopOver, setShowPopOver] = useState(false)
    
    const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']
    
    const [reactToMessage] = useMutation(REACT_TO_MESSAGE_MUTATION, {
        onError: (err) => {
            console.log(err)
        },
        onCompleted: (data) => {
            setShowPopOver(false)
        }
    })
    
    const reactionIcons = [...new Set(message.reactions.map((reaction) => reaction.content))]
    
    const react = (reaction) => {
        reactToMessage({ variables: { uuid: message.uuid, content: reaction } })
    }
    
    const reactButton = (
        <OverlayTrigger
            trigger='click'
            placement='top'
            show={showPopOver}
            onToggle={setShowPopOver}
            rootClose
            overlay={
                <Popover className='rounded-pill'>
                    <Popover.Content className='d-flex px-0 py-2 align-items-center react-btn-popover'>
                        { reactions.map((reaction) => (
                            <Button 
                                key={reaction} 
                                variant='link' 
                                className='react-icon-btn'
                                onClick={() => react(reaction)}
                            >
                                { reaction }
                            </Button>
                        )) }
                    </Popover.Content>
                </Popover>
            }
        >
            <Button variant='link' className='px-2'>
                <i className="far fa-smile"></i>
            </Button>
        </OverlayTrigger>
    )
    
    return (
        <div className={classNames('d-flex my-2', {
            'ml-auto': sent,
            'mr-auto': received
        })}>
            <div className='d-flex align-items-start'>
                {/* if we sent the message smile icon appears infront of the text */}
                { sent && reactButton }
                <div>
                    <div className={classNames('py-2 px-3 rounded-pill position-relative', { 
                        'bg-primary': sent,
                        'bg-secondary': received
                    })}>
                        <div>
                            <p className={classNames({ 'text-white': sent })}>
                                {message.content}
                            </p>
                        </div>
                        <div>
                            { 
                                message.reactions.length > 0 && (
                                    <div className={classNames("rounded-pill position-absolute", {'received-msg-reaction': received, 'sent-msg-reaction': sent})}>
                                        { reactionIcons }
                                    </div>
                                ) 
                            }
                        </div>
                    </div>
                    <div>
                        <p className={classNames('text-sent-received-time px-1', { 'pt-2': !!reactionIcons })}>
                            {moment(message.createdAt).fromNow()}
                        </p>
                    </div>
                </div>
                {/* if we received the message the smile icon appears after the text */}
                { received && reactButton }
            </div>
        </div>
    )
}

export default MessageItem
