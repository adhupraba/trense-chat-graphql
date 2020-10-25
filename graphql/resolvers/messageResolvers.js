const { UserInputError, withFilter } = require('apollo-server')
const { Op } = require('sequelize')

const { User, Message, Reaction } = require('../../models')
const auth = require('../../middleware/auth')

const messageResolvers = {
    Query: {
        getMessages: async (parent, args, context) => {
            
            const authorized = auth(context)
            const { from } = args
            
            try {
                const targetUser = await User.findOne({ where: { username: from } })
                
                if (!targetUser) {
                    throw new UserInputError('User not found!')
                }
                
                const usernames = [authorized.username, targetUser.username]
                
                const messages = await Message.findAll({ 
                    where: { 
                        from: { [Op.in]:  usernames}, 
                        to: { [Op.in]: usernames } 
                    },
                    order: [['createdAt', 'DESC']], 
                    // includes reactions which has this messageId
                    include: [{ model: Reaction, as: 'reactions' }]
                })
                
                return messages
            } catch (err) {
                console.log(err)
                throw err
            }
        }
    },
    Mutation: {
        sendMessage: async (parent, args, context) => {
            
            const authorized = auth(context)
            const { pubSub } = context
            const { to, content } = args
            
            try {
                const recipient = await User.findOne({ where: { username: to } })
                
                if (!recipient) {
                    throw new UserInputError('User not found')
                } else if (recipient.username === authorized.username) {
                    throw new UserInputError('You can\'t message to yourself')
                }
                
                if (content.trim() === '') {
                    throw new UserInputError('Message is empty')
                }
                
                const message = await Message.create({
                    from: authorized.username,
                    to,
                    content
                })
                pubSub.publish('NEW_MESSAGE', {newMessage: message})
                // console.log(message.toJSON())
                return message
            } catch (err) {
                console.log(err)
                throw err
            }
        }
    },
    Subscription: {
        newMessage: {
            subscribe: withFilter((parent, args, context) => {
                const authorized = auth(context)
                const { pubSub } = context
                return pubSub.asyncIterator('NEW_MESSAGE')
            }, (parent, args, context) => {
                const authorized = auth(context)
                // ! parent is in sendMessage mutation pubSub.publish()
                if (parent.newMessage.from === authorized.username || parent.newMessage.to === authorized.username) {
                    return true
                }
                return false
            })
        }
    }
}

module.exports = messageResolvers