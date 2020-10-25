import { gql } from '@apollo/client'

export const NEW_MESSAGE_SUBSCRIPTION = gql`
    subscription NewMessage {
        newMessage {
            uuid
            content
            from
            to
            createdAt
        }
    }
`

export const NEW_REACTION_SUBSCRIPTION = gql`
    subscription NewReaction {
        newReaction {
            uuid
            content
            message {
                uuid
                from
                to
            }
        }
    }
`