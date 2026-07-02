import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AddBook = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    language: 'English',
    price: '',
    stock: '',
    coverImage: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/books', {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book');
    }
  };

  return (
    <div className="section">
      <h2>Add New Book</h2>
      <form className="checkout-form" onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <div className="row">
          <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} required />
          <input name="language" placeholder="Language" value={form.language} onChange={handleChange} />
        </div>
        <div className="row">
          <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        </div>
        <input name="coverImage" placeholder="Cover Image URL (optional)" value={form.coverImage} onChange={handleChange} />
        <button type="submit" className="btn-primary">
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
