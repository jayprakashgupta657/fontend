import React from 'react';
import { Link } from 'react-router-dom';
import './PurchaseDetails.css';

const PurchaseDetails = () => {
  const [orderDetails, setOrderDetails] = React.useState(null);

  React.useEffect(() => {
    const storedOrder = localStorage.getItem('currentOrder');
    if (storedOrder) {
      setOrderDetails(JSON.parse(storedOrder));
    }
  }, []);

  if (!orderDetails) {
    return (
      <div className="purchase-details-container">
        <div className="purchase-details-content">
          <h1>Loading order details...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="purchase-details-container">
      <div className="purchase-details-content">
        <div className="purchase-header">
          <h1>Order Confirmation</h1>
          <div className="order-info">
            <p>Order ID: {orderDetails.orderId}</p>
            <p>Date: {orderDetails.date}</p>
          </div>
        </div>

        <div className="order-sections">
          <div className="order-section">
            <h2>Items Ordered</h2>
            <div className="items-list">
              {orderDetails.items.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    <p>Rs. {item.price} × {item.quantity}</p>
                    <p className="subtotal">Rs. {item.subtotal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-section customer-info">
            <h2>Customer Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Name:</label>
                <p>{orderDetails.customerInfo.name}</p>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <p>{orderDetails.customerInfo.email}</p>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <p>{orderDetails.customerInfo.phone}</p>
              </div>
              <div className="info-item">
                <label>Address:</label>
                <p>{orderDetails.customerInfo.address}</p>
              </div>
              <div className="info-item">
                <label>City:</label>
                <p>{orderDetails.customerInfo.city}</p>
              </div>
              <div className="info-item">
                <label>State:</label>
                <p>{orderDetails.customerInfo.state}</p>
              </div>
            </div>
          </div>

          <div className="order-section">
            <h2>Payment Details</h2>
            <div className="payment-info">
              <div className="payment-item">
                <label>Payment Method:</label>
                <p>{orderDetails.paymentMethod}</p>
              </div>
              <div className="price-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>Rs. {orderDetails.subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>Rs. {orderDetails.shipping}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>Rs. {orderDetails.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="actions">
          <button className="print-button" onClick={() => window.print()}>
            Print Invoice
          </button>
          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetails;
