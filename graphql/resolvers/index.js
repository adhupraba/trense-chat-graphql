const { User, Message, Reaction } = require('../../models')
const messageResolvers = require('./messageResolvers')
const userResolvers = require('./userResolvers')
const reactionResolvers = require('./reactionResolvers')

const resolvers = {
    Message: {
        createdAt: (parent) => parent.createdAt.toISOString()
    },
    User: {
        createdAt: (parent) => parent.createdAt.toISOString()
    },
    Reaction: {
        createdAt: (parent) => parent.createdAt.toISOString(),
        message: async (parent) => await Message.findByPk(parent.messageId),
        user: async (parent) => await User.findByPk(parent.userId, { attributes: ['username', 'imageUrl', 'createdAt'] })
    },
    Query: {
        ...userResolvers.Query,
        ...messageResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...messageResolvers.Mutation,
        ...reactionResolvers.Mutation
    },
    Subscription: {
        ...messageResolvers.Subscription,
        ...reactionResolvers.Subscription
    }
}

module.exports = resolvers