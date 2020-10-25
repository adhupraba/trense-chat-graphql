import React, { useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { Link } from 'react-router-dom'

import { REGISTER_MUTATION } from '../graphql/mutations'

const Register = (props) => {
    
    const [errors, setErrors] = useState({})
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    
    const [registerUser, { loading }] = useMutation(REGISTER_MUTATION, {
        update: (cache, result) => {
            props.history.push('/login')
        },
        onError: (err) => {
            // console.log(err.graphQLErrors[0].extensions.errors)
            setErrors(err.graphQLErrors[0].extensions.errors)
        }
    })
    
    const { username, email, password, confirmPassword } = userData
    
    const onChangeHandler = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value})
    }
    
    const onRegisterHandler = (e) => {
        e.preventDefault()
        // if (password.trim() === '') {
        //     return
        // }
        // if (confirmPassword.trim() === '') {
        //     return
        // }
        registerUser({ variables: userData })
    }
    
    return (
        <Row className='bg-white py-5 justify-content-center rounded'>
            <Col sm={8} md={6} lg={4}>
                <h1 className='text-center'>Register</h1>
                <Form onSubmit={onRegisterHandler}>
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
                        <Form.Label className={errors.email && 'text-danger'}>
                            {errors.email ?? 'Email Address'}
                        </Form.Label>
                        <Form.Control 
                            className={errors.email && 'is-invalid'}
                            type='email' 
                            value={email} 
                            name='email' 
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
                    <Form.Group>
                        <Form.Label className={errors.confirmPassword && 'text-danger'}>
                            {errors.confirmPassword ?? 'Confirm Password'}
                        </Form.Label>
                        <Form.Control 
                            className={errors.confirmPassword && 'is-invalid'}
                            type='password' 
                            value={confirmPassword} 
                            name='confirmPassword' 
                            onChange={onChangeHandler} 
                        />
                    </Form.Group>
                    <div className='text-center justify-content-between'>
                        <Button variant='success' type='submit' disabled={loading}>
                            { loading ? 'Loading' : 'Register' }
                        </Button>
                        <br/>
                        <small>Already have an account? <Link to='/login'>Login</Link></small>
                    </div>
                </Form>
            </Col>
        </Row>
    )
}

export default Register
