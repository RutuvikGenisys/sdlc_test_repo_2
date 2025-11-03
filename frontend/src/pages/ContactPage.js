import React, { useState } from 'react';
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    // Simulate sending email/message to customer support
    // In a real application, you would send this to your backend API
    // and then the backend would handle sending an email via a service like SendGrid, Nodemailer, etc.
    console.log('Contact form submitted:', formData);

    try {
      // const response = await api.post('/api/contact', formData);
      // if (response.status === 200) {
          setStatus('Message sent successfully! We will get back to you soon.');
          setFormData({ name: '', email: '', subject: '', message: '' });
      // } else {
      //     setStatus('Failed to send message. Please try again.');
      // }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="contact-page-container">
      <h1>Contact Customer Support</h1>
      <p>Our team is here to help! Please choose a method below to get assistance.</p>

      <div className="contact-options">
        <div className="contact-card">
          <h2>Email Us</h2>
          <p>Send us a detailed message, and we'll respond within 24-48 hours.</p>
          <p><strong>Email:</strong> support@mobilestore.com</p>
        </div>

        <div className="contact-card">
          <h2>Call Us</h2>
          <p>Speak directly with a customer support representative.</p>
          <p><strong>Phone:</strong> +1 (800) 123-4567</p>
          <p>Available Mon-Fri, 9 AM - 5 PM EST</p>
        </div>

        <div className="contact-card">
          <h2>Live Chat</h2>
          <p>Get instant help from our online support agents.</p>
          <p>_Live chat feature coming soon!_</p>
        </div>
      </div>

      <div className="contact-form-section">
        <h2>Send Us a Message</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Your Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
          </div>
          <button type="submit" disabled={status === 'Sending...'}>Send Message</button>
        </form>
        {status && <p className="form-status-message">{status}</p>}
      </div>

      <div className="knowledge-base-section">
        <h2>Frequently Asked Questions</h2>
        <p>Before contacting us, you might find answers in our <a href="#">Knowledge Base (Coming Soon)</a>.</p>
      </div>

    </div>
  );
}

export default ContactPage;
