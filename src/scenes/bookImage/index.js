import React, { useState, useEffect } from 'react';

function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('https://secondhandbookstoreapi.azurewebsites.net/api/BookImages')
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.log(error));
  }, []);

  return (
    <div>
      <h1>List of Books</h1>
      <ul>
        {books.map(book => (
          <li key={book.bookImageId}>
            <h2>{book.bookId}</h2>
            {/* <img src={book.url} alt={book.url} /> */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Books;
