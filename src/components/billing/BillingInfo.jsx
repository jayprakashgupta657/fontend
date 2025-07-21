import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BillingInfo.css';

const BillingInfo = () => {
  const [billingInfo, setBillingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nepal',
    paymentMethod: 'cod'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Billing Info:', billingInfo);
    // Here you would handle the billing information submission
  };

  return (
    <div className="billing-container">
      <div className="billing-content">
        <div className="billing-header">
          <h1>Billing Information</h1>
          <p>Please fill in your billing details to complete your purchase</p>
        </div>

        <div className="billing-form-section">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={billingInfo.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={billingInfo.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={billingInfo.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="address">Street Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={billingInfo.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter your street address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={billingInfo.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter your city"
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State/Province</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={billingInfo.state}
                  onChange={handleChange}
                  required
                  placeholder="Enter your state"
                />
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={billingInfo.zipCode}
                  onChange={handleChange}
                  required
                  placeholder="Enter ZIP code"
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={billingInfo.country}
                  onChange={handleChange}
                  required
                  placeholder="Enter your country"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="paymentMethod">Payment Method</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={billingInfo.paymentMethod}
                  onChange={handleChange}
                  required
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="khalti">Khalti</option>
                  <option value="esewa">eSewa</option>
                </select>
              </div>
            </div>

            <div className="button-group">
              <Link to="/cart" className="back-button">
                Back to Cart
              </Link>
              <button type="submit" className="submit-button">
                Review Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BillingInfo;
