const { ApolloServer, PubSub } = require('apollo-server')
const { sequelize } = require('./models/index')

const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/typedefs/typeDefs')

const pubSub = new PubSub()

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req, connection}) => ({req, connection, pubSub})
})

server.listen().then(({url}) => {
    console.log(`Server started at ${url}`)
    
    sequelize.authenticate().then(() => {
        console.log('MySQL DB connected!')
    }).catch((err) => {
        console.log(err)
    })
})
