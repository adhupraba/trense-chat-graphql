import React from 'react'
import { Row, Button, Image } from 'react-bootstrap'

import { useAuthState, useAuthDispatch } from '../context/auth'
import { LOGOUT } from '../context/types'

const NavBar = () => {
    
    const { user } = useAuthState()
    const dispatch = useAuthDispatch()
    
    const defaultUserImg = 'https://image.freepik.com/free-vector/mafia-man-character-with-glasses-ans-cigar_23-2148473395.jpg'
    
    const onLogoutHandler = () => {
        dispatch({
            type: LOGOUT
        })
        window.location.href = '/login'
    }
    
    return (
        <Row className='bg-dark justify-content-around mb-1 rounded align-items-center'>
            <div className='navbar-user-content'>
                <Image src={user.imageUrl || defaultUserImg} className='navbar-user-image' />
                <p className='text-secondary'>{user.username}</p>
            </div>
            <h4 className='app-title mb-0'>Trense Chat</h4>
            <Button variant='link' onClick={onLogoutHandler}>Logout</Button>
        </Row>
    )
}

export default NavBar
