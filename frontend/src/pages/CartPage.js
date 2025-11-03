import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

function CartPage() {
  const { cartItems, updateCartQuantity, removeFromCart, clearCart } = useContext(CartContext);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-container">
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/" className="continue-shopping-button">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <h1>Your Shopping Cart</h1>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <Link to={`/device/${item._id}`}><h3>{item.name}</h3></Link>
              <p>Price: ${item.price.toFixed(2)}</p>
              <div className="quantity-controls">
                <button onClick={() => updateCartQuantity(item._id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateCartQuantity(item._id, item.quantity + 1)}>+</button>
              </div>
              <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeFromCart(item._id)} className="remove-button">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h2>Total: ${totalAmount.toFixed(2)}</h2>
        <Link to="/checkout" className="checkout-button">Proceed to Checkout</Link>
        <button onClick={clearCart} className="clear-cart-button">Clear Cart</button>
        <Link to="/" className="continue-shopping-button">Continue Shopping</Link>
      </div>
    </div>
  );
}

export default CartPage;
