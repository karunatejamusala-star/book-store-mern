import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('books');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksRes, ordersRes] = await Promise.all([
        api.get('/books?limit=100'),
        api.get('/orders'),
      ]);
      setBooks(booksRes.data.books);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteBook = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    await api.delete(`/books/${id}`);
    fetchData();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    fetchData();
  };

  if (loading) return <p className="section">Loading admin dashboard...</p>;

  return (
    <div className="section">
      <h2>Admin Dashboard</h2>

      <div className="tabs">
        <button className={tab === 'books' ? 'active' : ''} onClick={() => setTab('books')}>
          Books
        </button>
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>
          Orders
        </button>
      </div>

      {tab === 'books' && (
        <div>
          <Link to="/admin/add-book" className="btn-primary" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            + Add New Book
          </Link>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>{book.stock}</td>
                  <td>
                    <button className="link-btn" onClick={() => deleteBook(book._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'orders' && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-6).toUpperCase()}</td>
                <td>{order.user?.name}</td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>
                  <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}>
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
