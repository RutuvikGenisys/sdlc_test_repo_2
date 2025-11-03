import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import './DeviceDetailPage.css';

function DeviceDetailPage() {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchDevice = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/devices/${id}`);
        setDevice(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching device:', err);
        setError('Failed to load device details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchDevice();
  }, [id]);

  const handleAddToCart = () => {
    if (device) {
      addToCart(device, quantity);
      alert(`${quantity} x ${device.name} added to cart!`);
    }
  };

  if (loading) return <div className="loading">Loading device details...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!device) return <div className="not-found">Device not found.</div>;

  return (
    <div className="device-detail-container">
      <div className="device-detail-image-section">
        <img src={device.imageUrl} alt={device.name} className="device-detail-image" />
      </div>
      <div className="device-detail-info-section">
        <h1>{device.name}</h1>
        <p className="device-detail-brand">Brand: {device.brand}</p>
        <p className="device-detail-model">Model: {device.model}</p>
        <p className="device-detail-price">Price: ${device.price.toFixed(2)}</p>
        <p className="device-detail-description">{device.description}</p>
        <p className="device-detail-stock">Status: {device.stockQuantity > 0 ? `In Stock (${device.stockQuantity})` : 'Out of Stock'}</p>

        {device.specifications && Object.keys(device.specifications).length > 0 && (
          <div className="device-specifications">
            <h3>Specifications:</h3>
            <ul>
              {Object.entries(device.specifications).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="add-to-cart-controls">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.min(parseInt(e.target.value) || 1, device.stockQuantity))}
            className="quantity-input"
            disabled={device.stockQuantity === 0}
          />
          <button
            onClick={handleAddToCart}
            disabled={device.stockQuantity === 0}
            className="add-to-cart-button"
          >
            {device.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeviceDetailPage;
