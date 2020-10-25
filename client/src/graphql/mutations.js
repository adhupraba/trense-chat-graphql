import { gql } from '@apollo/client'

export const REGISTER_MUTATION = gql`
    mutation RegisterUser($username: String!, $email: String!, $password: String!, $confirmPassword: String!) {
        register(username: $username, email: $email, password: $password, confirmPassword: $confirmPassword) {
            username
            email
            token
            createdAt
        }
    }
`

export const SEND_MESSAGE_MUTATION = gql`
    mutation SendMessage($to: String!, $content: String!) {
        sendMessage(to: $to, content: $content) {
            uuid
            content
            from
            to
            createdAt
        }
    }
`

export const REACT_TO_MESSAGE_MUTATION = gql`
    mutation ReactToMessage($uuid: String!, $content: String!) {
        reactToMessage(uuid: $uuid, content: $content) {
            uuid
        }
    }
`