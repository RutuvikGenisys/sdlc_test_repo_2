import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer-container">
      <p>&copy; {new Date().getFullYear()} Mobile Store. All rights reserved.</p>
      <div className="social-links">
        <a href="#">Facebook</a>
        <a href="#">Twitter</a>
        <a href="#">Instagram</a>
      </div>
    </footer>
  );
}

export default Footer;
