import React from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { REMOVE_BOOK } from '../utils/mutations';

import { useMutation, useQuery } from '@apollo/client';
import { QUERY_GET_ME } from '../utils/queries';

const SavedBooks = () => {
  const [removeBook] = useMutation(REMOVE_BOOK, {
    refetchQueries: [QUERY_GET_ME],
  }); // refetchQueries updates savedBooks every time a book is deleted. this is necessary because the GET_ME query is not automatically rerun when a mutation occurs.
  // source for refetchQueries: https://www.apollographql.com/docs/react/data/mutations/#refetching-queries
  const { loading, data } = useQuery(QUERY_GET_ME);
  const userData = data?.me || {}; // if data exists, store it in userData; otherwise, userData is an empty object {}

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await removeBook({ variables: { bookId } });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing {userData.username}'s saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books. Get started by clicking "Search For Books" in the top right corner.'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <a target='_blank' rel='noopener noreferrer' href={book.link} className='small'>{book.link ? 'Google Books link' : 'No link was found for this book'}</a>
                    <br></br><br></br>
                    {/* make space between link and delete button */}
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
