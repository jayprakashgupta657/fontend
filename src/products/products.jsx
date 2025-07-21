import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Products.css";

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: '', price: '', image: '', descriptions: '', category: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    useEffect(() => {
        fetchProducts();

        // Listen to product deletions from dashboard
        const checkProducts = () => {
            fetch("/products")
                .then(res => res.json())
                .then(newData => {
                    // Only update if the number of products has changed
                    if (newData.length !== products.length) {
                        setProducts(newData);
                    }
                })
                .catch(err => console.error("Error checking products:", err));
        };

        // Check every 2 seconds for product changes
        const interval = setInterval(checkProducts, 2000);

        return () => clearInterval(interval);
    }, [products.length]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape' && showDetails) {
                setIsExiting(true);
                setTimeout(() => {
                    setShowDetails(false);
                    setIsExiting(false);
                }, 300);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [showDetails]);

    const fetchProducts = () => {
        fetch("/products")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => setError("Error fetching products"));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    price: form.price,
                    image: form.image,
                    descriptions: form.descriptions,
                    category: form.category
                })
            });
            if (!res.ok) throw new Error('Failed to add product');
            setForm({ name: '', price: '', image: '', descriptions: '', category: '' });
            setShowForm(false);
            fetchProducts();
        } catch (err) {
            setError('Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product) => {
        try {
            setAddingToCart(true);
            // Get existing cart from localStorage
            const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
            
            console.log('Adding product:', product);  // Debug log
            
            // Debug logs
            console.log('Current cart:', existingCart);
            console.log('Product being added:', product);
            
            // Check if product already exists in cart
            const existingItemIndex = existingCart.findIndex(item => {
                console.log('Comparing:', item.productId, product.id);
                return item.productId === product.id;
            });
            
            if (existingItemIndex !== -1) {
                // If product exists, increase quantity
                existingCart[existingItemIndex].quantity += 1;
                console.log('Increasing quantity for existing item');
            } else {
                // If product doesn't exist, add new item
                const newItem = {
                    productId: product.id,
                    quantity: 1,
                    price: product.price,
                    product_name: product.name,
                    image: product.image,
                    description: product.descriptions
                };
                console.log('New cart item:', newItem);  // Debug log
                existingCart.push(newItem);
            }
            
            // Save updated cart back to localStorage
            localStorage.setItem('cart', JSON.stringify(existingCart));

            // Update UI to show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Added to cart!';
            document.body.appendChild(successMessage);
            
            // Remove the message after 2 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 2000);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add product to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    // Add styles for success message
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .success-message {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #4CAF50;
                color: white;
                padding: 1rem 2rem;
                border-radius: 4px;
                animation: slideIn 0.3s ease-out;
                z-index: 1000;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        return () => style.remove();
    }, []);

    const groupByCategory = (products) => {
        return products.reduce((acc, product) => {
            const category = product.category || 'Uncategorized';
            if (!acc[category]) acc[category] = [];
            acc[category].push(product);
            return acc;
        }, {});
    };

    return (
        <div className="products-container">
            <div className="products-header">
                <span className="products-title">Explore our Handicrafts</span>
                <button className="add-product-btn" onClick={() => setShowForm(true)}>
                    + Add Product
                </button>
            </div>

            {showForm && (
                <div className="product-modal-overlay">
                    <div className="product-modal">
                        <button className="product-modal-close" onClick={() => setShowForm(false)}>&times;</button>
                        <h3>Add New Product</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Product Name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="number"
                                name="price"
                                placeholder="Price"
                                value={form.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                            />
                            <input
                                type="text"
                                name="image"
                                placeholder="Image URL"
                                value={form.image}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="descriptions"
                                placeholder="Description"
                                value={form.descriptions}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="category"
                                placeholder="Category (e.g. bamboo, mud)"
                                value={form.category}
                                onChange={handleChange}
                                required
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? 'Adding...' : 'Add Product'}
                            </button>
                        </form>
                        {error && <div className="error-message">{error}</div>}
                    </div>
                </div>
            )}

            <div className="products-section">
                {Object.entries(groupByCategory(products)).map(([category, items]) => (
                    <div key={category} className="category-section">
                        <h2 className="category-title">{category.charAt(0).toUpperCase() + category.slice(1)} Handicrafts</h2>
                        <div className="products-grid">
                            {items.map((product) => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image-container">
                                        <img 
                                            src={product.image || '/placeholder.jpg'} 
                                            alt={product.name} 
                                            className="product-image"
                                            onError={(e) => {
                                                e.target.onerror = null; // Prevent infinite loop
                                                e.target.src = 'https://placehold.co/400x400?text=Product+Image';
                                            }}
                                        />
                                    </div>
                                    <h3>{product.name}</h3>
                                    <button 
                                        className="add-to-cart-btn" 
                                        onClick={() => handleAddToCart(product)}
                                        disabled={addingToCart}
                                    >
                                        {addingToCart ? 'Adding...' : 'Add to Cart'}
                                    </button>
                                    <p>Price: ${product.price}</p>
                                    <button 
                                        className="view-details-btn"
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setShowDetails(true);
                                        }}
                                    >
                                        <i className="fas fa-eye"></i> View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Product Details Modal */}
            {showDetails && selectedProduct && (
                <div className={`product-details-modal ${isExiting ? 'exiting' : ''}`}>
                    <div className="modal-content">
                        <div className="modal-actions">
                            <div className="modal-controls">
                                <button 
                                    className="minimize-modal"
                                    title="Minimize"
                                    onClick={() => {
                                        const modal = document.querySelector('.modal-content');
                                        if (modal) {
                                            modal.classList.toggle('minimized');
                                        }
                                    }}
                                >
                                    <i className="fas fa-minus"></i>
                                </button>
                                <button 
                                    className="exit-modal"
                                    title="Close"
                                    onClick={() => setShowExitConfirm(true)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        
                        {showExitConfirm && (
                            <div className="exit-confirmation-overlay">
                                <div className="exit-confirmation">
                                    <h3>Exit Product View</h3>
                                    <p>Are you sure you want to close this product view?</p>
                                    <div className="exit-actions">
                                        <button 
                                            className="confirm-exit"
                                            onClick={() => {
                                                setIsExiting(true);
                                                setTimeout(() => {
                                                    setShowDetails(false);
                                                    setIsExiting(false);
                                                    setShowExitConfirm(false);
                                                }, 300);
                                            }}
                                        >
                                            <i className="fas fa-check"></i> Yes, Exit
                                        </button>
                                        <button 
                                            className="cancel-exit"
                                            onClick={() => setShowExitConfirm(false)}
                                        >
                                            <i className="fas fa-times"></i> Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="modal-header">
                            <div className="modal-image-gallery">
                                <img 
                                    src={selectedProduct.image || '/placeholder.jpg'} 
                                    alt={selectedProduct.name} 
                                    className="modal-product-image main-image" 
                                />
                            </div>
                            <div className="modal-product-info">
                                <div className="product-header">
                                    <h2>{selectedProduct.name}</h2>
                                    <div className="product-badges">
                                        <span className="modal-category">{selectedProduct.category}</span>
                                        <span className="badge handmade">
                                            <i className="fas fa-hands"></i> Handmade
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="modal-price-info">
                                    <div className="price-details">
                                        <h3>Rs. {selectedProduct.price}</h3>
                                    </div>
                                    <span className="modal-stock in-stock">
                                        <i className="fas fa-check-circle"></i> In Stock
                                    </span>
                                </div>

                                <div className="product-actions">
                                    <button 
                                        className="add-to-cart-modal-btn"
                                        onClick={() => {
                                            handleAddToCart(selectedProduct);
                                            setShowDetails(false);
                                        }}
                                        disabled={addingToCart}
                                    >
                                        <i className="fas fa-shopping-cart"></i>
                                        {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-details">
                            <div className="detail-section">
                                <h4><i className="fas fa-info-circle"></i> Product Description</h4>
                                <div className="rich-description">
                                    <p>{selectedProduct.descriptions}</p>
                                </div>
                            </div>
                            
                            <div className="detail-section specifications">
                                <h4><i className="fas fa-list"></i> Product Features</h4>
                                <div className="features-grid">
                                    <div className="feature-item">
                                        <i className="fas fa-paint-brush"></i>
                                        <h5>Handcrafted</h5>
                                        <p>Each piece is unique and handmade by skilled artisans</p>
                                        <button 
                                            className="quick-exit"
                                            onClick={() => {
                                                setIsExiting(true);
                                                setTimeout(() => {
                                                    setShowDetails(false);
                                                    setIsExiting(false);
                                                }, 300);
                                            }}
                                        >
                                            <i className="fas fa-sign-out-alt"></i>
                                            Quick Exit
                                        </button>
                                    </div>
                                    <div className="feature-item">
                                        <i className="fas fa-leaf"></i>
                                        <h5>Eco-Friendly</h5>
                                        <p>Made with sustainable materials and practices</p>
                                        <div className="keyboard-shortcut">
                                            <span>Press <kbd>Esc</kbd> to exit</span>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <i className="fas fa-certificate"></i>
                                        <h5>Quality Assured</h5>
                                        <p>Thoroughly checked for quality and craftsmanship</p>
                                        <button 
                                            className="minimize-view"
                                            onClick={() => {
                                                const modal = document.querySelector('.modal-content');
                                                if (modal) {
                                                    modal.classList.toggle('minimized');
                                                }
                                            }}
                                        >
                                            <i className="fas fa-compress-alt"></i>
                                            Minimize View
                                        </button>
                                    </div>
                                    <div className="feature-item">
                                        <i className="fas fa-heart"></i>
                                        <h5>Traditional Design</h5>
                                        <p>Reflects authentic cultural artistry</p>
                                        <button 
                                            className="save-for-later"
                                            onClick={() => {
                                                // Add save for later functionality here
                                                alert('Feature coming soon!');
                                            }}
                                        >
                                            <i className="fas fa-bookmark"></i>
                                            Save for Later
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4><i className="fas fa-box"></i> Care Instructions</h4>
                                <ul className="care-instructions">
                                    <li><i className="fas fa-hand-sparkles"></i> Clean gently with soft cloth</li>
                                    <li><i className="fas fa-temperature-low"></i> Keep away from extreme temperatures</li>
                                    <li><i className="fas fa-sun"></i> Avoid direct sunlight exposure</li>
                                    <li><i className="fas fa-water"></i> Keep away from moisture</li>
                                </ul>
                            </div>

                            <div className="detail-section shipping-info">
                                <h4><i className="fas fa-shipping-fast"></i> Shipping & Delivery</h4>
                                <div className="shipping-details">
                                    <div className="shipping-item">
                                        <i className="fas fa-truck"></i>
                                        <span>Free Delivery on orders above Rs. 5000</span>
                                    </div>
                                    <div className="shipping-item">
                                        <i className="fas fa-box-open"></i>
                                        <span>Secure Packaging</span>
                                    </div>
                                    <div className="shipping-item">
                                        <i className="fas fa-undo"></i>
                                        <span>Easy Returns within 7 days</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
