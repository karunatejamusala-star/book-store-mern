import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => (
  <Link to={`/books/${book._id}`} className="book-card">
    <img src={book.coverImage} alt={book.title} />
    <div className="book-card-body">
      <h3>{book.title}</h3>
      <p className="author">{book.author}</p>
      <p className="genre">{book.genre}</p>
      <div className="book-card-footer">
        <span className="price">${book.price.toFixed(2)}</span>
        <span className="rating">⭐ {book.rating?.toFixed(1) || '0.0'}</span>
      </div>
    </div>
  </Link>
);

export default BookCard;
