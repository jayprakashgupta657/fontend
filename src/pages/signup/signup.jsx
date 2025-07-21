import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

const Signup = ({ setIsAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: '',
        color: '#e0e0e0'
    });

    const checkPasswordStrength = (password) => {
        let score = 0;
        let message = '';
        let color = '#e0e0e0';

        if (password.length >= 8) score++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++;
        if (password.match(/\d/)) score++;
        if (password.match(/[^a-zA-Z\d]/)) score++;

        switch (score) {
            case 0:
                message = 'Very Weak';
                color = '#ff4444';
                break;
            case 1:
                message = 'Weak';
                color = '#ffbb33';
                break;
            case 2:
                message = 'Fair';
                color = '#ffbb33';
                break;
            case 3:
                message = 'Good';
                color = '#00C851';
                break;
            case 4:
                message = 'Strong';
                color = '#007E33';
                break;
            default:
                message = '';
        }

        setPasswordStrength({ score, message, color });
    };
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }

        // Check password strength when password field changes
        if (name === 'password') {
            checkPasswordStrength(value);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(formData.password)) {
                newErrors.password = 'Password must be at least 8 characters and include uppercase, lowercase, number and special character';
            }
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            try {
                // Simulate API call to your backend
                const response = await mockSignupAPI(formData);

                // On successful signup
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('user', JSON.stringify(response.user));
                setIsAuthenticated(true);
                navigate('/dashboard');
            } catch (error) {
                setErrors({
                    ...errors,
                    form: error.message || 'Signup failed. Please try again.'
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Mock API function - replace with actual API call
    const mockSignupAPI = async (data) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate successful response
                if (data.email && data.password) {
                    resolve({
                        success: true,
                        user: {
                            id: '123',
                            name: data.name,
                            email: data.email
                        },
                        token: 'mock-auth-token'
                    });
                } else {
                    reject(new Error('Registration failed'));
                }
            }, 1500);
        });
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Create Your Account</h2>
                <p className="subtitle">Join our community today</p>

                {errors.form && <div className="error-message">{errors.form}</div>}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? 'error' : ''}
                            required
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            required
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            required
                            minLength="8"
                        />
                        {formData.password && (
                            <div className="password-strength">
                                <div className="strength-bar">
                                    {[...Array(4)].map((_, index) => (
                                        <div
                                            key={index}
                                            className="strength-segment"
                                            style={{
                                                backgroundColor: index < passwordStrength.score ? passwordStrength.color : '#e0e0e0'
                                            }}
                                        />
                                    ))}
                                </div>
                                <span className="strength-text" style={{ color: passwordStrength.color }}>
                                    {passwordStrength.message}
                                </span>
                            </div>
                        )}
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? 'error' : ''}
                            required
                        />
                        {errors.confirmPassword && (
                            <span className="error-text">{errors.confirmPassword}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner"></span> Creating Account...
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                <div className="login-link">
                    Already have an account? <Link to="/login">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;