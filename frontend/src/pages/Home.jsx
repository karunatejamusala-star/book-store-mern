import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import BookCard from '../components/BookCard';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await api.get('/books?limit=8&sort=rating');
        setBooks(data.books);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>Your One-Stop Destination for All Things Books</h1>
          <p>
            Discover new releases, timeless classics, and everything in between. Browse,
            review, and buy your favorite books — anytime, anywhere.
          </p>
          <Link to="/books" className="btn-primary">
            Browse Books
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>Popular Picks</h2>
        {loading ? (
          <p>Loading books...</p>
        ) : (
          <div className="book-grid">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
