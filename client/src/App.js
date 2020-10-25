import React from 'react'
import { Container } from 'react-bootstrap'
import { BrowserRouter, Switch } from 'react-router-dom'
import './App.scss'

import Register from './pages/Register'
import Home from './pages/Home'
import Login from './pages/Login'
import { AuthProvider } from './context/auth'
import { MessageProvider } from './context/message'
import AuthRoute from './routes/AuthRoute'

const App = () => {
    return (
        <AuthProvider>
            <MessageProvider>
                <BrowserRouter>
                    <Container className='pt-4'>
                        <Switch>
                            <AuthRoute exact path='/' component={Home} authenticated />                
                            <AuthRoute path='/register' component={Register} guest />                
                            <AuthRoute path='/login' component={Login} guest />   
                        </Switch>             
                    </Container>
                </BrowserRouter>
            </MessageProvider>
        </AuthProvider>
    )
}

export default App