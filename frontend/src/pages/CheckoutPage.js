import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './CheckoutPage.css';

function CheckoutPage() {
  const { cartItems, totalAmount, clearCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleShippingChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add items before checking out.');
      setLoading(false);
      return;
    }

    const orderData = {
      cartItems: cartItems.map(item => ({
        deviceId: item._id,
        quantity: item.quantity,
      })),
      shippingAddress,
      paymentMethod,
    };

    try {
      const response = await api.post('/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        alert('Order placed successfully!');
        clearCart();
        navigate('/orders'); // Redirect to order history
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="checkout-page-container">Please log in to proceed to checkout.</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page-container">
        <h1>Checkout</h1>
        <p>Your cart is empty. <Link to="/">Continue Shopping</Link></p>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      <h1>Checkout</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmitOrder} className="checkout-form">
        <h2>Shipping Information</h2>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input type="text" id="address" name="address" value={shippingAddress.address} onChange={handleShippingChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="city">City:</label>
          <input type="text" id="city" name="city" value={shippingAddress.city} onChange={handleShippingChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="postalCode">Postal Code:</label>
          <input type="text" id="postalCode" name="postalCode" value={shippingAddress.postalCode} onChange={handleShippingChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country:</label>
          <input type="text" id="country" name="country" value={shippingAddress.country} onChange={handleShippingChange} required />
        </div>

        <h2>Payment Method</h2>
        <div className="form-group">
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Credit Card"
              checked={paymentMethod === 'Credit Card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Credit Card
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            PayPal
          </label>
          {/* Add more payment options as needed */}
        </div>

        <h2>Order Summary</h2>
        <div className="order-summary">
          {cartItems.map((item) => (
            <p key={item._id}>{item.name} ({item.quantity}) - ${(item.price * item.quantity).toFixed(2)}</p>
          ))}
          <h3>Total: ${totalAmount.toFixed(2)}</h3>
        </div>

        <button type="submit" disabled={loading} className="place-order-button">
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}

export default CheckoutPage;
