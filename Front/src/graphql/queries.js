import { gql } from '@apollo/client';
export const GET_ME = gql`
  query {
    me {
      id
      username
    }
  }
`;
export const GET_ALL_USERS = gql`
  query {
    findAll {
      id
      username
      createdAt
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($conversationId: String!) {
    getMessages(conversationId: $conversationId) {
      id
      content
      senderId
      createdAt
    }
  }
`;


export const GET_MY_CONVERSATIONS = gql`
  query {
  myConversations {
    id
    title
    createdAt
    updatedAt
    participants {
      id
      username
    }
    messages {
      id
      content
      senderId
      createdAt
    }
  }
}

`;
