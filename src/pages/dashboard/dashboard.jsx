import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        wishlistItems: 0,
        cartItems: 0,
        totalProducts: 0
    });

    const fetchProducts = async () => {
        try {
            const response = await fetch('/products');
            const data = await response.json();
            setProducts(data);
            return data;
        } catch (err) {
            console.error('Error fetching products:', err);
            return [];
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            const isMultiple = productId === 'batch';
            const idsToDelete = isMultiple ? selectedProducts : [productId];
            
            // Delete all selected products
            let result = await Promise.all(idsToDelete.map(id => 
                fetch(`/products/delete/${id}`, { method: 'DELETE' })
            ));
            
            if (!result.every(res => res.ok)) {
                throw new Error('Failed to delete one or more products');
            }

            // Update products list
            setProducts(products.filter(p => !idsToDelete.includes(p.id)));
            setDeleteConfirm(null);
            setSelectedProducts([]);

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = `${isMultiple ? 'Selected products' : 'Product'} deleted successfully!`;
            document.body.appendChild(successMessage);
            setTimeout(() => successMessage.remove(), 2000);
        } catch (err) {
            console.error('Error deleting product(s):', err);
            alert('Failed to delete product(s)');
        }
    };

    useEffect(() => {
        // Fetch user data from localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            try {
                const parsedData = JSON.parse(storedUserData);
                console.log('User data from storage:', parsedData);
                setUserData(parsedData);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        } else {
            console.log('No user data found in localStorage');
        }
        
        // Get cart items
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Fetch products
        fetchProducts().then(productsData => {
            // Calculate stats
            setStats({
                totalOrders: Math.floor(Math.random() * 10), // Mock data
                totalSpent: Math.floor(Math.random() * 10000),
                wishlistItems: Math.floor(Math.random() * 5),
                cartItems: cart.length,
                totalProducts: productsData.length
            });
        });

        // Mock recent orders
        setOrders([
            { id: 1, date: '2025-07-19', status: 'Delivered', amount: 2500 },
            { id: 2, date: '2025-07-15', status: 'Processing', amount: 1800 },
            { id: 3, date: '2025-07-10', status: 'Shipped', amount: 3200 }
        ]);
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>Welcome back, {userData?.name || 'Guest'}!</h1>
                    <p className="last-login">Last login: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="profile-section">
                    <div className="profile-avatar">
                        <i className="fas fa-user-circle"></i>
                    </div>
                    <div className="profile-info">
                        <p className="email">{userData?.email || 'guest@example.com'}</p>
                        <button className="edit-profile-btn">
                            <i className="fas fa-edit"></i> Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card orders">
                    <i className="fas fa-shopping-bag"></i>
                    <div className="stat-info">
                        <h3>Total Orders</h3>
                        <p>{stats.totalOrders}</p>
                    </div>
                </div>
                <div className="stat-card spent">
                    <i className="fas fa-rupee-sign"></i>
                    <div className="stat-info">
                        <h3>Total Spent</h3>
                        <p>₹{stats.totalSpent}</p>
                    </div>
                </div>
                <div className="stat-card wishlist">
                    <i className="fas fa-heart"></i>
                    <div className="stat-info">
                        <h3>Wishlist Items</h3>
                        <p>{stats.wishlistItems}</p>
                    </div>
                </div>
                <div className="stat-card cart">
                    <i className="fas fa-shopping-cart"></i>
                    <div className="stat-info">
                        <h3>Cart Items</h3>
                        <p>{stats.cartItems}</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="manage-products">
                    <div className="section-header">
                        <h2><i className="fas fa-box"></i> Product Management</h2>
                        <div className="product-actions">
                            <button className="view-all-btn" onClick={() => navigate('/products')}>
                                <i className="fas fa-eye"></i> View All Products
                            </button>
                            <button 
                                className="remove-products-btn" 
                                onClick={() => setDeleteConfirm('batch')}
                                disabled={products.length === 0}
                            >
                                <i className="fas fa-trash-alt"></i> Remove Products
                            </button>
                        </div>
                    </div>
                    
                    <div className="products-table">
                        <div className="table-header">
                            <span>Select</span>
                            <span>Product</span>
                            <span>Category</span>
                            <span>Price</span>
                            <span>Actions</span>
                        </div>
                        <div className="table-body">
                            {products.slice(0, 5).map(product => (
                                <div key={product.id} className="table-row">
                                    <div className="checkbox-cell">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.includes(product.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedProducts([...selectedProducts, product.id]);
                                                } else {
                                                    setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="product-cell">
                                        <img src={product.image} alt={product.name} />
                                        <span>{product.name}</span>
                                    </div>
                                    <span>{product.category}</span>
                                    <span>₹{product.price}</span>
                                    <div className="row-actions">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => navigate(`/products/edit/${product.id}`)}
                                            title="Edit product"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => setDeleteConfirm(product.id)}
                                            title="Delete product"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="recent-orders">
                    <h2><i className="fas fa-shopping-bag"></i> Recent Orders</h2>
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="order-item">
                                <div className="order-info">
                                    <span className="order-id">Order #{order.id}</span>
                                    <span className="order-date">{order.date}</span>
                                </div>
                                <div className="order-status">
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="order-amount">₹{order.amount}</div>
                                <button className="view-order-btn">
                                    <i className="fas fa-eye"></i> View Details
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {deleteConfirm && (
                <div className="delete-confirmation-overlay">
                    <div className="delete-confirmation">
                        <h3><i className="fas fa-exclamation-triangle"></i> Confirm Delete</h3>
                        <p>
                            {deleteConfirm === 'batch' ? (
                                selectedProducts.length > 0 ?
                                    `Are you sure you want to delete ${selectedProducts.length} selected product(s)? This action cannot be undone.` :
                                    'Please select products to delete first.'
                            ) : (
                                'Are you sure you want to delete this product? This action cannot be undone.'
                            )}
                        </p>
                        <div className="confirmation-actions">
                            <button 
                                className="confirm-delete"
                                onClick={() => handleDeleteProduct(deleteConfirm)}
                                disabled={deleteConfirm === 'batch' && selectedProducts.length === 0}
                            >
                                <i className="fas fa-trash"></i> Delete
                                {deleteConfirm === 'batch' && selectedProducts.length > 0 && ` (${selectedProducts.length})`}
                            </button>
                            <button 
                                className="cancel-delete"
                                onClick={() => {
                                    setDeleteConfirm(null);
                                    if (deleteConfirm === 'batch') {
                                        setSelectedProducts([]);
                                    }
                                }}
                            >
                                <i className="fas fa-times"></i> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
