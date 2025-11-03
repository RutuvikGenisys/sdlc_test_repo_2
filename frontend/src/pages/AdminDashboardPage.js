import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './AdminDashboardPage.css';

function AdminDashboardPage() {
  const { token } = useContext(AuthContext);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [formData, setFormData] = useState({
    name: '', brand: '', model: '', price: '', description: '', imageUrl: '', stockQuantity: '', specifications: {} // Object for specs
  });

  useEffect(() => {
    fetchDevices();
  }, [token]);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/devices');
      setDevices(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError('Failed to load devices for admin dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('spec_')) { // Handle dynamic specifications
      const specKey = name.replace('spec_', '');
      setFormData(prev => ({
        ...prev,
        specifications: { ...prev.specifications, [specKey]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddDevice = () => {
    setIsEditing(false);
    setCurrentDevice(null);
    setFormData({ name: '', brand: '', model: '', price: '', description: '', imageUrl: '', stockQuantity: '', specifications: {} });
  };

  const handleEditDevice = (device) => {
    setIsEditing(true);
    setCurrentDevice(device);
    setFormData({
      name: device.name,
      brand: device.brand,
      model: device.model,
      price: device.price,
      description: device.description,
      imageUrl: device.imageUrl,
      stockQuantity: device.stockQuantity,
      specifications: device.specifications || {},
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const deviceData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
      };

      if (isEditing) {
        await api.put(`/api/devices/${currentDevice._id}`, deviceData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Device updated successfully!');
      } else {
        await api.post('/api/devices', deviceData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Device added successfully!');
      }
      fetchDevices();
      setFormData({ name: '', brand: '', model: '', price: '', description: '', imageUrl: '', stockQuantity: '', specifications: {} });
      setIsEditing(false);
      setCurrentDevice(null);
    } catch (err) {
      console.error('Error saving device:', err);
      setError(err.response?.data?.message || 'Failed to save device.');
    }
  };

  const handleDeleteDevice = async (id) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        await api.delete(`/api/devices/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Device deleted successfully!');
        fetchDevices();
      } catch (err) {
        console.error('Error deleting device:', err);
        setError(err.response?.data?.message || 'Failed to delete device.');
      }
    }
  };

  if (loading) return <div className="loading">Loading admin data...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="admin-dashboard-container">
      <h1>Admin Dashboard</h1>

      <div className="device-form-section">
        <h2>{isEditing ? 'Edit Device' : 'Add New Device'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group"><label>Name:</label><input type="text" name="name" value={formData.name} onChange={handleFormChange} required /></div>
          <div className="form-group"><label>Brand:</label><input type="text" name="brand" value={formData.brand} onChange={handleFormChange} required /></div>
          <div className="form-group"><label>Model:</label><input type="text" name="model" value={formData.model} onChange={handleFormChange} required /></div>
          <div className="form-group"><label>Price:</label><input type="number" name="price" value={formData.price} onChange={handleFormChange} required min="0" step="0.01" /></div>
          <div className="form-group"><label>Stock Quantity:</label><input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleFormChange} required min="0" /></div>
          <div className="form-group"><label>Description:</label><textarea name="description" value={formData.description} onChange={handleFormChange}></textarea></div>
          <div className="form-group"><label>Image URL:</label><input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleFormChange} /></div>
          
          <h3>Specifications (e.g., display, camera)</h3>
          {Object.entries(formData.specifications).map(([key, value]) => (
            <div className="form-group spec-item" key={key}>
              <label>{key}:</label>
              <input type="text" name={`spec_${key}`} value={value} onChange={handleFormChange} />
              <button type="button" onClick={() => setFormData(prev => {
                  const newSpecs = { ...prev.specifications };
                  delete newSpecs[key];
                  return { ...prev, specifications: newSpecs };
              })}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => {
            const newSpecKey = prompt('Enter new specification name (e.g., display):');
            if (newSpecKey) {
              setFormData(prev => ({
                ...prev,
                specifications: { ...prev.specifications, [newSpecKey]: '' }
              }));
            }
          }}>Add Specification</button>

          <button type="submit" className="save-button">{isEditing ? 'Update Device' : 'Add Device'}</button>
          {isEditing && <button type="button" onClick={handleAddDevice} className="cancel-button">Cancel Edit</button>}
        </form>
      </div>

      <div className="inventory-list-section">
        <h2>Current Inventory</h2>
        <div className="device-inventory-list">
          {devices.map((device) => (
            <div key={device._id} className="inventory-item-card">
              <img src={device.imageUrl} alt={device.name} className="inventory-item-image" />
              <div className="inventory-item-details">
                <h3>{device.name} ({device.model})</h3>
                <p>Brand: {device.brand}</p>
                <p>Price: ${device.price.toFixed(2)}</p>
                <p>Stock: <span className={device.stockQuantity < 5 ? 'low-stock' : ''}>{device.stockQuantity}</span></p>
                <div className="inventory-item-actions">
                  <button onClick={() => handleEditDevice(device)} className="edit-button">Edit</button>
                  <button onClick={() => handleDeleteDevice(device._id)} className="delete-button">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
