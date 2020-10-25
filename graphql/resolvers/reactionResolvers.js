const { UserInputError, withFilter, AuthenticationError, ForbiddenError } = require('apollo-server')

const { User, Message, Reaction } = require('../../models')
const auth = require('../../middleware/auth')

const reactionResolvers = {
    Mutation: {
        reactToMessage: async (parent, args, context) => {
            
            const { username } = auth(context)
            const { pubSub } = context
            const { uuid, content } = args
            const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']
            
            try {
                // Validate reaction content
                if (!reactions.includes(content)) {
                    throw new UserInputError('Invalid Reaction')
                }
                // get user
                const user = await User.findOne({ where: { username } })
                
                if (!user) {
                    throw new AuthenticationError('Unauthenticated')
                }
                // get message
                const message = await Message.findOne({ where: { uuid } })
                
                if (!message) {
                    throw new UserInputError('Message not found')
                }
                
                if (message.from !== user.username && message.to !== user.username) {
                    throw new ForbiddenError('Unauthorized')
                }
                
                let reaction = await Reaction.findOne({ 
                    where: { messageId: message.id, userId: user.id } 
                })
                
                if (reaction) {
                    // if reaction exisits, then update it
                    reaction.content = content
                    await reaction.save()
                } else {
                    // reaction doesn't exist, create it
                    reaction = await Reaction.create({
                        messageId: message.id,
                        userId: user.id,
                        content
                    })
                }
                pubSub.publish('NEW_REACTION', {newReaction: reaction})
                
                return reaction
            } catch (err) {
                console.log(err)
                throw err
            }
        }
    },
    Subscription: {
        newReaction: {
            subscribe: withFilter((parent, args, context) => {
                const authorized = auth(context)
                const { pubSub } = context
                
                return pubSub.asyncIterator('NEW_REACTION')
            }, async (parent, args, context) => {
                const { username } = auth(context)
                // ! parent is in reactToMessage mutation pubSub.publish()
                const message = await parent.newReaction.getMessage()
                // console.log(parent)
                // console.log(message)
                if (message.from === username || message.to === username) {
                    return true
                }
                return false
            })
        }
    }
}

module.exports = reactionResolvers