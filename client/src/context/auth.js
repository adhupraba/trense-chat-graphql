import React, { createContext, useContext, useReducer } from 'react'
import jwtDecode from 'jwt-decode'

import { LOGIN, LOGOUT } from './types'

const AuthStateContext = createContext()
const AuthDispatchContext = createContext()

let user

const token = localStorage.getItem('token')
if (token) {
    const decodedToken = jwtDecode(token)
    const expAt = new Date(decodedToken.exp * 1000)
    
    if (new Date() > expAt) {
        localStorage.removeItem('token')
    } else {
        user = decodedToken
    }
} else {
    console.log('No token')
}

const initialState = {
    user: user
}

const authReducer = (state, action) => {
    switch (action.type) {
        case LOGIN:
            localStorage.setItem('token', action.payload.token)
            return {
                ...state,
                user: action.payload
            }
        case LOGOUT:
            localStorage.removeItem('token')
            return {
                ...state,
                user: null
            }
        default:
            return state
    }
}

export const AuthProvider = (props) => {
    
    const [state, dispatch] = useReducer(authReducer, initialState)
    
    return (
        <AuthDispatchContext.Provider value={dispatch}>
            <AuthStateContext.Provider value={state}>
                {props.children}
            </AuthStateContext.Provider>
        </AuthDispatchContext.Provider>
    )
}

export const useAuthState = () => useContext(AuthStateContext)
export const useAuthDispatch = () => useContext(AuthDispatchContext)