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
