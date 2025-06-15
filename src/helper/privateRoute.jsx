import { Navigate } from 'react-router-dom';
import './privateRoute.css';

// const PrivateRoute = ({ isAuthenticated }) => {
//     return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
// };

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;