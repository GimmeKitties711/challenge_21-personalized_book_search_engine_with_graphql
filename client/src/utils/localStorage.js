export const getSavedBookIds = () => {
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : []; // get the savedBooks array from localStorage if the user has saved books; otherwise, return an empty array

  return savedBookIds;
};

export const saveBookIds = (bookIdArr) => {
  if (bookIdArr.length) { // if there is at least one book in bookIdArr, save bookIdArr to localStorage
    localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
  } else { // if there are no books in bookIdArr, remove it from localStorage
    localStorage.removeItem('saved_books');
  }
};

export const removeBookId = (bookId) => {
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : null;

  if (!savedBookIds) { // if there are no saved books
    return false;
  }

  const updatedSavedBookIds = savedBookIds?.filter((savedBookId) => savedBookId !== bookId);
  // filter out the book associated with bookId. the ? is a conditional check to make sure savedBookIds exists before trying to filter it. source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
  localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));
  // update localStorage with the new updateSavedBookIds array

  return true;
};
