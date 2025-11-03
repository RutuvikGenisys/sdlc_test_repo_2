import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt:desc'
  });
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/api/devices?${params}`);
        setDevices(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching devices:', err);
        setError('Failed to load devices. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddToCart = (device) => {
    addToCart(device, 1);
    alert(`${device.name} added to cart!`);
  };

  if (loading) return <div className="loading">Loading devices...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="home-page-container">
      <h1>Available Mobile Devices</h1>

      <div className="filters-container">
        <input
          type="text"
          name="brand"
          placeholder="Filter by Brand"
          value={filters.brand}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="model"
          placeholder="Filter by Model"
          value={filters.model}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
        />
        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value="createdAt:desc">Newest</option>
          <option value="price:asc">Price: Low to High</option>
          <option value="price:desc">Price: High to Low</option>
          <option value="name:asc">Name: A-Z</option>
          <option value="name:desc">Name: Z-A</option>
        </select>
      </div>

      <div className="device-list">
        {devices.length === 0 ? (
          <p>No devices found matching your criteria.</p>
        ) : (
          devices.map((device) => (
            <div key={device._id} className="device-card">
              <Link to={`/device/${device._id}`}>
                <img src={device.imageUrl} alt={device.name} className="device-image" />
                <h2>{device.name}</h2>
              </Link>
              <p className="device-brand">Brand: {device.brand}</p>
              <p className="device-model">Model: {device.model}</p>
              <p className="device-price">${device.price.toFixed(2)}</p>
              <p className="device-stock">Stock: {device.stockQuantity}</p>
              <button
                onClick={() => handleAddToCart(device)}
                disabled={device.stockQuantity === 0}
                className="add-to-cart-button"
              >
                {device.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;
