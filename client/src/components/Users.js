import React, { Fragment } from 'react'
import { Col, Image } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import classNames from 'classnames'

import { GET_USERS_QUERY } from '../graphql/queries'
import { useMessageDispatch, useMessageState } from '../context/message'
import { SET_USERS, SET_SELECTED_USER } from '../context/types'

const Users = () => {
    
    const defaultUserImg = 'https://image.freepik.com/free-vector/mafia-man-character-with-glasses-ans-cigar_23-2148473395.jpg'
    
    const dispatch = useMessageDispatch()
    const { users } = useMessageState()
    // users?.find((user) => user.isSelected === true)
    // this means that if the users array exists then it will find()....
    // else it will be undefined
    const selectedUser = users?.find((user) => user.isSelected === true)?.username
    
    const { loading } = useQuery(GET_USERS_QUERY, {
        onCompleted: (data) => {
            dispatch({
                type: SET_USERS,
                payload: data.getUsers
            })
        },
        onError: (err) => {
            console.log(err)
        }
    })
    
    const onSelectUser = (username) => {
        dispatch({
            type: SET_SELECTED_USER,
            payload: username
        })
    }
    
    let usersMarkup
    
    if (!users || loading) {
        usersMarkup = ( <p className='users-markup text-muted'>Loading.....</p> )
    } else if (users.length === 0) {
        usersMarkup = ( <p className='users-markup text-muted'>No users have joined yet!</p> )
    } else if (users.length > 0) {
        usersMarkup = users.map((user) => {
            
            const selected = (selectedUser === user.username)
            
            return (
                <Fragment key={user.username}>
                    <div 
                        role='button'
                        className={classNames('d-flex p-3 justify-content-center justify-content-md-start select-user', { 'bg-dark': selected })} 
                        onClick={() => onSelectUser(user.username)}
                    >
                        <Image src={user.imageUrl || defaultUserImg} className='user-image' />
                        <div className='d-none d-md-block ml-2'>
                            <p className='text-success'>{user.username}</p>
                            <p className={classNames('font-weight-light', { 'text-muted': selected })}>
                                { user.latestMessage ? user.latestMessage.content : 'You are now connected' }
                            </p>
                        </div>
                    </div>
                    <div className='px-3'>
                        <hr className='m-0' />
                    </div>
                </Fragment>
            )
        })
    }
    
    return (
        <Col xs={2} md={4} className='p-0 users-list'>
            {usersMarkup}
        </Col>
    )
}

export default Users
