import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';


const SavedBooks = () => {
  const { loading, data } = useQuery(GET_LOGGEDINUSER);

  let userData = data?.loggedInUser || {};

  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  const userDataLength = Object.keys(userData).length;

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBook({
        variables: { bookId }
      });

      if (!data.removeBook) {
        throw new Error('error with removing book');
      }
      userData = data.removeBook;
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };


  if (!userDataLength) {
    return <h2>loading ...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Your Saved Books</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `${userData.savedBooks.length} ${userData.savedBooks.length === 1 ? 'book saved' : 'books saved'}:`
            : 'Go save sum stuff and come back here uwu'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`${book.title} cover`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
