import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './OrderHistoryPage.css';

function OrderHistoryPage() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError('You must be logged in to view your orders.');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await api.get('/api/orders/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || 'Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const handleViewDetails = async (orderId) => {
    setTrackingInfo(null);
    setSelectedOrder(null); // Clear previous selection
    try {
        const response = await api.get(`/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setSelectedOrder(response.data);
    } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.response?.data?.message || 'Failed to load order details.');
    }
  };

  const handleTrackOrder = async (orderId) => {
    setTrackingLoading(true);
    setTrackingError(null);
    try {
      const response = await api.get(`/api/orders/${orderId}/track`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTrackingInfo(response.data);
    } catch (err) {
      console.error('Error fetching tracking info:', err);
      setTrackingError(err.response?.data?.message || 'Failed to get tracking information.');
      setTrackingInfo(null);
    } finally {
      setTrackingLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (orders.length === 0) return <div className="order-history-container"><p>You have not placed any orders yet.</p></div>;

  return (
    <div className="order-history-container">
      <h1>My Order History</h1>
      <div className="order-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
            <p><strong>Status:</strong> {order.orderStatus}</p>
            <div className="order-actions">
                <button onClick={() => handleViewDetails(order._id)} className="view-details-button">View Details</button>
                <button onClick={() => handleTrackOrder(order._id)} className="track-order-button">Track Order</button>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="order-details-modal">
          <h2>Order Details for #{selectedOrder._id}</h2>
          <p><strong>Shipping To:</strong> {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}</p>
          <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
          <p><strong>Current Status:</strong> {selectedOrder.orderStatus}</p>
          <h3>Items:</h3>
          <ul>
            {selectedOrder.orderItems.map((item, index) => (
              <li key={index}>{item.name} x {item.quantity} (${item.price.toFixed(2)} each)</li>
            ))}
          </ul>
          <h4>Total Amount: ${selectedOrder.totalAmount.toFixed(2)}</h4>
          <button onClick={() => setSelectedOrder(null)}>Close</button>
        </div>
      )}

      {trackingLoading && <div className="loading">Getting tracking info...</div>}
      {trackingError && <div className="error-message">{trackingError}</div>}
      {trackingInfo && ( 
        <div className="tracking-info-modal">
          <h2>Tracking Information</h2>
          <p><strong>Order Status:</strong> {trackingInfo.orderStatus}</p>
          <p><strong>Tracking Number:</strong> {trackingInfo.trackingNumber || 'N/A'}</p>
          <p>_Mock Tracking update: Your package is currently being processed at our distribution center._</p>
          <button onClick={() => setTrackingInfo(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default OrderHistoryPage;
