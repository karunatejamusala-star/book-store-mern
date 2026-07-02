import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');

  const fetchBook = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/books/${id}`);
      setBook(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(book, quantity);
    navigate('/cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    try {
      await api.post(`/books/${id}/reviews`, { rating: reviewRating, comment: reviewComment });
      setReviewComment('');
      setReviewMsg('Review submitted!');
      fetchBook();
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <p className="section">Loading...</p>;
  if (!book) return <p className="section">Book not found.</p>;

  return (
    <div className="section book-detail">
      <div className="book-detail-grid">
        <img src={book.coverImage} alt={book.title} />
        <div>
          <h1>{book.title}</h1>
          <p className="author">by {book.author}</p>
          <p className="genre-lang">
            {book.genre} • {book.language}
          </p>
          <p className="rating">⭐ {book.rating?.toFixed(1)} ({book.reviews.length} reviews)</p>
          <p className="description">{book.description}</p>
          <p className="price">${book.price.toFixed(2)}</p>
          <p className="stock">{book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}</p>

          {book.stock > 0 && (
            <div className="add-to-cart-row">
              <input
                type="number"
                min="1"
                max={book.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              <button className="btn-primary" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <h2>Reviews</h2>
        {book.reviews.length === 0 && <p>No reviews yet. Be the first to review!</p>}
        {book.reviews.map((r, idx) => (
          <div key={idx} className="review">
            <strong>{r.name}</strong> — ⭐ {r.rating}
            <p>{r.comment}</p>
          </div>
        ))}

        {user ? (
          <form className="review-form" onSubmit={submitReview}>
            <h3>Write a review</h3>
            <select value={reviewRating} onChange={(e) => setReviewRating(e.target.value)}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} Star{n > 1 ? 's' : ''}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Share your thoughts..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">
              Submit Review
            </button>
            {reviewMsg && <p className="msg">{reviewMsg}</p>}
          </form>
        ) : (
          <p>
            Please <a href="/login">login</a> to write a review.
          </p>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
