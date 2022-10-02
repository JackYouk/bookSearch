import { gql } from '@apollo/client';

export const GET_LOGGEDINUSER = gql`
query LoggedInUser {
  loggedInUser {
    _id
    username
    email
    bookCount
    savedBooks {
      authors
      description
      bookId
      image
      link
      title
    }
  }
}
`;