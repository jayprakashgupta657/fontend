import { Link } from 'react-router-dom';
import './navbar.css'; // Assuming you have a CSS file for styling the navbar

const Navbar = ({ isAuthenticated, handleLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          MyApp
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Login/Signup
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;