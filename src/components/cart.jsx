import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Load cart items from localStorage
      const items = JSON.parse(localStorage.getItem('cart') || '[]');
      console.log('Cart items from localStorage:', items); // Debug log
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQuantityChange = (productId, change) => {
    const updatedCart = cartItems.map(item => {
      if (item.productId === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean); // Remove null items (quantity = 0)

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleRemove = (productId) => {
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="cart-title">Your Shopping Cart</h2>
      </div>

      {loading ? (
        <div className="cart-loading">Loading cart...</div>
      ) : cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty</p>
          <Link to="/products" className="cart-continue-shopping">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => {
              console.log('Rendering cart item:', item); // Debug log
              return (
                <div key={item.productId} className="cart-item">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.product_name} 
                      className="cart-item-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'placeholder-image.jpg'; // You can add a placeholder image
                      }}
                    />
                  ) : (
                    <div className="cart-item-image-placeholder">No Image</div>
                  )}
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.product_name || 'Unnamed Product'}</h3>
                    <p className="cart-item-price">Rs. {item.price || 0} each</p>
                    <div className="cart-item-quantity">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.productId, -1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.productId, 1)}
                      >
                        +
                      </button>
                    </div>
                    <p className="cart-item-subtotal">
                      Subtotal: Rs. {((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                    </p>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemove(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <span>Rs. {calculateTotal()}</span>
            </div>
            <button 
              className="checkout-btn"
              onClick={() => navigate('/billing')}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
            <Link to="/products" className="cart-continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
