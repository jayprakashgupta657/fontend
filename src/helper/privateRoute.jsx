import { Navigate, Outlet } from 'react-router-dom';
import './privateRoute.css';

const PrivateRoute = ({ isAuthenticated }) => {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;