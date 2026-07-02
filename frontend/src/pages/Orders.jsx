import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const statusColors = {
  pending: '#f0ad4e',
  confirmed: '#5bc0de',
  shipped: '#428bca',
  delivered: '#5cb85c',
  cancelled: '#d9534f',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="section">Loading orders...</p>;

  return (
    <div className="section">
      <h2>My Orders</h2>
      {orders.length === 0 && <p>You haven't placed any orders yet.</p>}
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <span>Order #{order._id.slice(-6).toUpperCase()}</span>
            <span
              className="status-badge"
              style={{ backgroundColor: statusColors[order.status] }}
            >
              {order.status}
            </span>
          </div>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>
                {item.title} × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <p className="total">Total: ${order.totalAmount.toFixed(2)}</p>
          <p className="date">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default Orders;
