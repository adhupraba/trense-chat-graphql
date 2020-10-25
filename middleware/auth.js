const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/env.json')
const { AuthenticationError } = require('apollo-server')

const auth = (context) => {
    // console.log(context)
    let authHeader, connectionAuth, token
    
    if (context.req) {
        authHeader = context.req.headers.authorization
        token = authHeader.split(' ')[1]
    } else if (context.connection) {
        connectionAuth = context.connection.context.Authorization
        token = connectionAuth.split(' ')[1]
    }
    
    if (authHeader || connectionAuth) {
        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET)
                return decoded
            } catch (err) {
                throw new AuthenticationError('Invalid/Expired token.')
            }
        }
        throw new Error('Authentication token is not available.')
    }
    throw new Error('Authorization Header not provided')
}

module.exports = auth