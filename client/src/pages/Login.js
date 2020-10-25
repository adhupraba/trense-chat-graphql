import React, { useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useLazyQuery } from '@apollo/client'
import { Link } from 'react-router-dom'

import { LOGIN_QUERY } from '../graphql/queries'
import { useAuthDispatch } from '../context/auth'
import { LOGIN } from '../context/types'

const Login = (props) => {
    
    const [errors, setErrors] = useState({})
    const [userData, setUserData] = useState({
        username: '',
        password: ''
    })
    
    const dispatch = useAuthDispatch()
    
    // useLazyQuery gets executed only when it is triggered using a button or something
    // unlike useLazyQuery, useQuery gets executed when the component is mounted and gives error the first time
    const [loginUser, { loading }] = useLazyQuery(LOGIN_QUERY, {
        onError: (err) => {
            // console.log(err.graphQLErrors[0].extensions.errors)
            setErrors(err.graphQLErrors[0].extensions.errors)
        },
        onCompleted: (data) => {
            dispatch({
                type: LOGIN,
                payload: data.login
            })
            window.location.href = '/'
        }
    })
    
    const { username, password } = userData
    
    const onChangeHandler = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value})
    }
    
    const onLoginHandler = (e) => {
        e.preventDefault()
        
        loginUser({ variables: userData })
    }
    
    return (
        <Row className='bg-white py-5 justify-content-center rounded'>
            <Col sm={8} md={6} lg={4}>
                <h1 className='text-center'>Login</h1>
                <Form onSubmit={onLoginHandler}>
                    <Form.Group>
                        <Form.Label className={errors.username && 'text-danger'}>
                            {errors.username ?? 'Username'}
                        </Form.Label>
                        <Form.Control 
                            className={errors.username && 'is-invalid'}
                            type='text' 
                            value={username} 
                            name='username' 
                            onChange={onChangeHandler} 
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className={errors.password && 'text-danger'}>
                            {errors.password ?? 'Password'}
                        </Form.Label>
                        <Form.Control 
                            className={errors.password && 'is-invalid'}
                            type='password' 
                            value={password} 
                            name='password' 
                            onChange={onChangeHandler} 
                        />
                    </Form.Group>
                    <div className='text-center'>
                        <Button variant='success' type='submit' disabled={loading}>
                            { loading ? 'Loading' : 'Login' }
                        </Button>
                        <br/>
                        <small>Don't have an account? <Link to='/register'>Register</Link></small>
                    </div>
                </Form>
            </Col>
        </Row>
    )
}

export default Login
