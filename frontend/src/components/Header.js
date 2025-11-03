import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Header.css';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="header-container">
      <div className="logo">
        <Link to="/">Mobile Store</Link>
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart ({totalCartItems})</Link>
        {user ? (
          <>
            <Link to="/orders">My Orders</Link>
            {user.role === 'admin' && <Link to="/admin/dashboard">Admin</Link>}
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <> 
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
}

export default Header;
