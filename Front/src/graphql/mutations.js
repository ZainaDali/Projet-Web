import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation Register($data: CreateUserInput!) {
    register(data: $data) {
      id
      username
      createdAt
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data)
  }
`;

export const CREATE_CONVERSATION = gql`
  mutation CreateConversation($data: CreateConversationInput!) {
    createConversation(data: $data) {
      id
      title
      createdAt
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($data: CreateMessageInput!) {
    sendMessage(data: $data) {
      id
      content
      senderId
      createdAt
    }
  }
`;
