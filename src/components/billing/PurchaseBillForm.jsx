import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PurchaseBillForm.css';

const PurchaseBillForm = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 100,
    total: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'cash'
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  useEffect(() => {
    // Load cart items from localStorage
    try {
      const items = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(items);
      
      // Calculate totals
      const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
      setOrderSummary({
        subtotal,
        shipping: 100,
        total: subtotal + 100
      });
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { tax, discount, total } = calculateFinalAmounts();
      
      // Store the order information
      const orderDetails = {
        orderId: "ORD-" + Date.now(),
        date: new Date().toLocaleDateString(),
        items: cartItems,
        subtotal: orderSummary.subtotal,
        shipping: orderSummary.shipping,
        tax: tax,
        discount: discount,
        total: total,
        customerInfo: formData,
        paymentMethod: formData.paymentMethod,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      };
      
      // Store the order details in localStorage
      localStorage.setItem('currentOrder', JSON.stringify(orderDetails));
      
      // Clear the cart
      localStorage.setItem('cart', '[]');
      
      // Navigate to the purchase details page
      navigate('/purchase-details');
    }
  };

  // Calculate final amounts including tax and discounts
  const calculateFinalAmounts = () => {
    const subtotal = orderSummary.subtotal;
    const shipping = orderSummary.shipping;
    const tax = subtotal * 0.13; // 13% VAT
    const discount = subtotal > 5000 ? subtotal * 0.05 : 0; // 5% discount for orders over 5000
    const total = subtotal + shipping + tax - discount;

    return {
      tax,
      discount,
      total
    };
  };

  const { tax, discount, total } = calculateFinalAmounts();

  return (
    <div className="purchase-bill-container">
      <div className="order-summary-section">
        <div className="summary-header">
          <h2>Order Summary</h2>
          <p className="order-date">Date: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="cart-items-summary">
          <div className="summary-table-header">
            <span>Item Description</span>
            <span>Amount</span>
          </div>
          {cartItems.map(item => (
            <div key={item.productId} className="summary-item">
              <div className="item-info">
                <div className="item-header">
                  <img src={item.image || '/assets/handmade_pottery.jpg'} alt={item.product_name} className="item-thumbnail" />
                  <div className="item-title">
                    <h3>{item.product_name}</h3>
                    <span className="item-category">{item.category || 'Handmade Pottery'}</span>
                  </div>
                </div>
                <div className="item-details">
                  <span className="quantity">
                    <i className="fas fa-box"></i>
                    Qty: {item.quantity}
                  </span>
                  <span className="unit-price">
                    <i className="fas fa-tag"></i>
                    Unit Price: Rs. {item.price.toFixed(2)}
                  </span>
                  {item.customization && (
                    <span className="customization">
                      <i className="fas fa-paint-brush"></i>
                      {item.customization}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="item-description">
                    <i className="fas fa-info-circle"></i>
                    {item.description}
                  </p>
                )}
              </div>
              <div className="item-price">
                <p className="subtotal">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                <button 
                  className="view-details-btn"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowDetails(true);
                  }}
                >
                  <i className="fas fa-eye"></i>
                  View Details
                </button>
                {item.warranty && (
                  <span className="warranty-info">
                    <i className="fas fa-shield-alt"></i>
                    {item.warranty}
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {showDetails && selectedItem && (
            <div className="product-details-modal">
              <div className="modal-content">
                <button className="close-modal" onClick={() => setShowDetails(false)}>
                  <i className="fas fa-times"></i>
                </button>
                <div className="modal-header">
                  <div className="modal-image-gallery">
                    <img 
                      src={selectedItem.image || '/assets/handmade_pottery.jpg'} 
                      alt={selectedItem.product_name} 
                      className="modal-product-image main-image" 
                    />
                    <div className="thumbnail-gallery">
                      {selectedItem.additionalImages?.map((img, index) => (
                        <img 
                          key={index}
                          src={img} 
                          alt={`${selectedItem.product_name} view ${index + 1}`} 
                          className="thumbnail-image"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="modal-product-info">
                    <div className="product-header">
                      <h2>{selectedItem.product_name}</h2>
                      <div className="product-badges">
                        <span className="modal-category">{selectedItem.category || 'Handmade Pottery'}</span>
                        {selectedItem.isHandmade && (
                          <span className="badge handmade">
                            <i className="fas fa-hands"></i> Handmade
                          </span>
                        )}
                        {selectedItem.isEcoFriendly && (
                          <span className="badge eco-friendly">
                            <i className="fas fa-leaf"></i> Eco-Friendly
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="modal-price-info">
                      <div className="price-details">
                        <h3>Rs. {selectedItem.price.toFixed(2)}</h3>
                        {selectedItem.originalPrice && (
                          <span className="original-price">Rs. {selectedItem.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <span className={`modal-stock ${selectedItem.stockQuantity > 10 ? 'in-stock' : 'low-stock'}`}>
                        <i className={`fas fa-${selectedItem.stockQuantity > 10 ? 'check-circle' : 'clock'}`}></i>
                        {selectedItem.stockQuantity > 10 ? 'In Stock' : 'Low Stock'}
                      </span>
                    </div>

                    <div className="product-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, index) => (
                          <i 
                            key={index}
                            className={`fas fa-star ${index < (selectedItem.rating || 0) ? 'filled' : ''}`}
                          ></i>
                        ))}
                      </div>
                      <span className="rating-count">
                        {selectedItem.reviewCount || 0} Reviews
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="modal-details">
                  <div className="detail-section">
                    <h4><i className="fas fa-info-circle"></i> Product Description</h4>
                    <div className="rich-description">
                      <p>{selectedItem.description || 'Handcrafted with care and attention to detail.'}</p>
                      {selectedItem.highlights && (
                        <ul className="product-highlights">
                          {selectedItem.highlights.map((highlight, index) => (
                            <li key={index}>
                              <i className="fas fa-check"></i>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  
                  <div className="detail-section specifications">
                    <h4><i className="fas fa-list"></i> Specifications</h4>
                    <div className="specs-grid">
                      <div className="spec-item">
                        <span className="spec-label">Material</span>
                        <span className="spec-value">{selectedItem.material || 'Premium Clay'}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Dimensions</span>
                        <span className="spec-value">{selectedItem.dimensions || 'Standard Size'}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Weight</span>
                        <span className="spec-value">{selectedItem.weight || 'Varies by item'}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Finish</span>
                        <span className="spec-value">{selectedItem.finish || 'Natural Glaze'}</span>
                      </div>
                      {selectedItem.color && (
                        <div className="spec-item">
                          <span className="spec-label">Color</span>
                          <span className="spec-value">{selectedItem.color}</span>
                        </div>
                      )}
                      {selectedItem.style && (
                        <div className="spec-item">
                          <span className="spec-label">Style</span>
                          <span className="spec-value">{selectedItem.style}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedItem.customization && (
                    <div className="detail-section">
                      <h4><i className="fas fa-paint-brush"></i> Customization</h4>
                      <p>{selectedItem.customization}</p>
                    </div>
                  )}
                  
                  <div className="detail-section">
                    <h4><i className="fas fa-box"></i> Package Contents</h4>
                    <ul>
                      <li>1 x {selectedItem.product_name}</li>
                      {selectedItem.accessories && selectedItem.accessories.map((accessory, index) => (
                        <li key={index}>1 x {accessory}</li>
                      ))}
                      <li>Care Instructions Manual</li>
                    </ul>
                  </div>
                  
                  {selectedItem.warranty && (
                    <div className="detail-section">
                      <h4><i className="fas fa-shield-alt"></i> Warranty Information</h4>
                      <p>{selectedItem.warranty}</p>
                    </div>
                  )}
                  
                  <div className="detail-section">
                    <h4><i className="fas fa-heart"></i> Care Instructions</h4>
                    <ul>
                      {selectedItem.careInstructions ? 
                        selectedItem.careInstructions.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        )) : 
                        <>
                          <li>Hand wash with mild soap</li>
                          <li>Avoid extreme temperatures</li>
                          <li>Handle with care</li>
                        </>
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="price-breakdown">
          <div className="price-row subtotal-row">
            <span>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
            <span>Rs. {orderSummary.subtotal.toFixed(2)}</span>
          </div>
          <div className="price-row shipping-row">
            <div className="shipping-info">
              <span>Shipping</span>
              <span className="shipping-method">(Standard Delivery)</span>
            </div>
            <span>Rs. {orderSummary.shipping.toFixed(2)}</span>
          </div>
          {orderSummary.subtotal > 5000 && (
            <div className="price-row discount-row">
              <span>Bulk Order Discount (5%)</span>
              <span>- Rs. {discount.toFixed(2)}</span>
            </div>
          )}
          <div className="price-row tax-row">
            <span>Estimated Tax (13% VAT)</span>
            <span>Rs. {tax.toFixed(2)}</span>
          </div>
          <div className="price-row total">
            <span>Total Amount</span>
            <span>Rs. {total.toFixed(2)}</span>
          </div>
        </div>

        <div className="order-notes">
          <p className="delivery-estimate">
            <i className="fas fa-truck"></i>
            Estimated Delivery: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </p>
          <p className="terms-note">
            By proceeding, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      <div className="billing-section">
        <h1>Billing Information</h1>
        <form onSubmit={handleSubmit} className="purchase-bill-form">
          <div className="form-row">
            <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? 'error' : ''}
            />
            {errors.city && <span className="error-message">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={errors.state ? 'error' : ''}
            />
            {errors.state && <span className="error-message">{errors.state}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="zipCode">ZIP Code</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className={errors.zipCode ? 'error' : ''}
            />
            {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={errors.country ? 'error' : ''}
            />
            {errors.country && <span className="error-message">{errors.country}</span>}
          </div>
        </div>

        <div className="form-group payment-method">
          <label>Payment Method</label>
          <div className="payment-options">
            <label className="radio-label">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formData.paymentMethod === 'cash'}
                onChange={handleChange}
              />
              Cash on Delivery
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={handleChange}
              />
              Card Payment
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Proceed to Payment
          </button>
          <button type="button" className="cancel-button" onClick={() => navigate('/cart')}>
            Back to Cart
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseBillForm;
