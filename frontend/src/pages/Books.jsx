import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import BookCard from '../components/BookCard';

const GENRES = ['Fiction', 'Science', 'Historical', 'Self-Help', 'Fantasy', 'Biography', 'Mystery'];

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const keyword = searchParams.get('keyword') || '';
  const genre = searchParams.get('genre') || '';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        if (genre) params.set('genre', genre);
        if (sort) params.set('sort', sort);
        params.set('page', page);
        params.set('limit', 12);

        const { data } = await api.get(`/books?${params.toString()}`);
        setBooks(data.books);
        setPages(data.pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [keyword, genre, sort, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', 1);
    setSearchParams(next);
  };

  return (
    <div className="section">
      <h2>All Books</h2>

      <div className="filters">
        <select value={genre} onChange={(e) => updateParam('genre', e.target.value)}>
          <option value="">All Genres</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
          <option value="">Sort by</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <>
          <div className="book-grid">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>

          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={p === page ? 'active' : ''}
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.set('page', p);
                  setSearchParams(next);
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Books;
