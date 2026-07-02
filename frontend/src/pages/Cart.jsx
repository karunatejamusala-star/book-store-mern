import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
  });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setPlacing(true);
    setError('');
    try {
      await api.post('/orders', {
        items: cartItems.map((item) => ({ book: item.book, quantity: item.quantity })),
        shippingAddress: address,
        paymentMethod: 'Cash on Delivery',
      });
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="section">
        <h2>Your Cart</h2>
        <p>Your cart is empty. Go add some books!</p>
      </div>
    );
  }

  return (
    <div className="section cart-page">
      <h2>Your Cart</h2>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.book} className="cart-item">
            <img src={item.coverImage} alt={item.title} />
            <div className="cart-item-info">
              <h4>{item.title}</h4>
              <p>${item.price.toFixed(2)} each</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.book, Number(e.target.value))}
            />
            <button className="link-btn" onClick={() => removeFromCart(item.book)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <h3>Total: ${totalPrice.toFixed(2)}</h3>

      <form className="checkout-form" onSubmit={placeOrder}>
        <h3>Shipping Details</h3>
        {error && <p className="error">{error}</p>}
        <input name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleChange} required />
        <input name="addressLine" placeholder="Address" value={address.addressLine} onChange={handleChange} required />
        <div className="row">
          <input name="city" placeholder="City" value={address.city} onChange={handleChange} required />
          <input name="state" placeholder="State" value={address.state} onChange={handleChange} required />
        </div>
        <div className="row">
          <input name="postalCode" placeholder="Postal Code" value={address.postalCode} onChange={handleChange} required />
          <input name="phone" placeholder="Phone" value={address.phone} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn-primary" disabled={placing}>
          {placing ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
        </button>
      </form>
    </div>
  );
};

export default Cart;
