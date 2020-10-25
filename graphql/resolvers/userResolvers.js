const { UserInputError } = require('apollo-server')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const { User, Message } = require('../../models')
const { JWT_SECRET } = require('../../config/env.json')
const auth = require('../../middleware/auth')

const userResolvers = {
    Query: {
        getUsers: async (parent, args, context) => {
            // console.log(context)
            const authorized = auth(context)
            try {
                // Op.ne means '!='
                let users = await User.findAll({ 
                    attributes: ['username', 'imageUrl', 'createdAt'],
                    where: { 
                        username: { [Op.ne]: authorized.username } 
                    } 
                })
                
                const allUserMessages = await Message.findAll({ 
                    where: { 
                        [Op.or]: [
                            { from: authorized.username },
                            { to: authorized.username }
                        ] 
                    } ,
                    order: [['createdAt', 'DESC']]
                })
                
                users = users.map((user) => {
                    const latestMessage = allUserMessages.find((message) => message.from === user.username || message.to === user.username)
                    user.latestMessage = latestMessage
                    return user
                })
                
                return users
            } catch (err) {
                console.log(err)
                throw err
            }
        },
        login: async (parent, args) => {
            
            const { username, password } = args
            let errors = {}
            
            try {
                if (username.trim() === '') 
                    errors.username = 'Username must not be empty'
                
                if (password.trim() === '') 
                    errors.password = 'Password must not be empty'
                
                if (Object.keys(errors).length > 0) {
                    throw new UserInputError('Bad Input', { errors })
                }
                
                const user = await User.findOne({ where: { username } })
                
                if (!user) {
                    errors.username = 'User not found!'
                    throw new UserInputError('user not found', { errors })
                }
                
                const isMatch = await bcrypt.compare(password, user.password)
                
                if (!isMatch) {
                    errors.password = 'Invalid Credentials!'
                    throw new UserInputError('invalid password', { errors })
                }
                
                const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' })
                
                return {
                    ...user.toJSON(),
                    token: token
                }
            } catch (err) {
                console.log(err)
                throw err
            }
        }
    },
    Mutation: {
        register: async (parent, args) => {
            
            const { username, email, password, confirmPassword } = args
            let errors = {}
            
            try {
                if (email.trim() === '') 
                    errors.email = 'Email must not be empty'
                    
                if (username.trim() === '') 
                    errors.username = 'Username must not be empty'
                
                if (password.trim() === '') 
                    errors.password = 'Password must not be empty'
                
                if (confirmPassword.trim() === '') 
                    errors.confirmPassword = 'Confirm Password must not be empty'
                
                if (confirmPassword && password !== confirmPassword) 
                    errors.confirmPassword = 'Passwords must match'
                
                if (Object.keys(errors).length > 0) {
                    throw errors
                }
                
                // ! WE DON'T NEED TO CHECK FOR EXISITING USERNAMES AND EMAIL IDS TO VALIDATE
                // ! MYSQL DOES IT BY ITESELF. IF THE USER ENTERS EXISTING USERNAME OR EMAIL
                // ! WE CONSOLE LOG IT TO EXTRACT THE ERROR MESSAGE FROM MYSQL AS SHOWN BELOW
                
                const passwd = await bcrypt.hash(password, 12)
                
                const newUser = await User.create({
                    username,
                    email,
                    password: passwd
                })
                
                return newUser
            } catch (err) {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    err.errors.forEach((e) => (errors[e.path.split('.')[1]] = `${e.path.split('.')[1]} is already taken`))
                } else if (err.name === 'SequelizeValidationError') {
                    err.errors.forEach((e) => (errors[e.path] = e.message))
                }
                throw new UserInputError('Bad Input', { errors })
            }
        }
    }
}

module.exports = userResolvers