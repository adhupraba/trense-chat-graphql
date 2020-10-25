import { gql } from '@apollo/client'

export const LOGIN_QUERY = gql`
    query LoginUser($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            username
            email
            token
            createdAt
        }
    }
`

export const GET_USERS_QUERY = gql`
    query GetUsers {
        getUsers {
            username
            createdAt
            imageUrl
            latestMessage {
                uuid
                content
                from
                to
                createdAt
            }
        }
    }
`

export const GET_MESSAGES_QUERY = gql`
    query GetMessages($from: String!) {
        getMessages(from: $from) {
            uuid
            content
            from
            to
            createdAt
            reactions {
                uuid
                content
            }
        }
    }
`