import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { baseUrl } from '../../helper/common';

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Fetch email and password from form database with help of email
            const body = {
                email: email,
                password: password
            }
            let auth = await axios.post(`${baseUrl}/authUser/login`, body);
            const userData = auth.data.user;

            // 2. Validate email and password
            // Simple authentication logic
            if (userData) {
                // 1. Set in localStorage
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userData', JSON.stringify(userData));

                // 2. Update state in parent component
                setIsAuthenticated(true);

                // 3. Navigate to dashboard
                navigate('/dashboard');
            } else {
                console.error('Invalid credentials');
                setError('Invalid credentials');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('Login failed. Please try again.');
        }
        finally {
            setIsSubmitting(false);
        }

    };


    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Login</h1>
                <p className="login-subtitle">Welcome back! Please enter your details</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="login-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="signup-text">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );

    // return (
    //     <div className="login-page">
    //         <h1>Login</h1>
    //         {error && <p className="error-message">{error}</p>}
    //         <form onSubmit={handleSubmit}>
    //             <div>
    //                 <label>Username:</label>
    //                 <input
    //                     type="text"
    //                     value={username}
    //                     onChange={(e) => setUsername(e.target.value)}
    //                     required
    //                 />
    //             </div>
    //             <div>
    //                 <label>Password:</label>
    //                 <input
    //                     type="password"
    //                     value={password}
    //                     onChange={(e) => setPassword(e.target.value)}
    //                     required
    //                 />
    //             </div>
    //             <button type="submit" className="login-button">Login</button>
    //         </form>
    //         <p className="signup-text">
    //             Don't have an account? <Link to="/signup">Sign up</Link>
    //         </p>
    //     </div>
    // );
};

export default Login;