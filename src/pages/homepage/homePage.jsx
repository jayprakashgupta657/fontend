import { NavLink } from 'react-router-dom';
import './homePage.css';

const Home = () => {
    return (
        <div className="home-header">
            <main className="main-content">
                <h2>Welcome to HandiCraft Marketplace</h2>
                <p>This is a platform to connect buyers with local artisans.</p>
                <NavLink to="/signup" className="main-button">
                    <span className="button-content">
                        <i className="fas fa-user-plus"></i>
                        Join Us
                    </span>
                </NavLink>
            </main>
            <section className="hero-section">
                <div className="hero-text">
                    <h1>Discover Unique Nepali Handicrafts</h1>
                    <p>Support local artisans and explore beautifully handcrafted products made with love and tradition.</p>
                    <div className="button-group">
                        <NavLink to="/products" className="hero-button">
                            <span className="button-content">
                                <i className="fas fa-shopping-bag"></i>
                                Shop Now
                            </span>
                        </NavLink>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="https://english.corporatekhabar.com/wp-content/uploads/2022/12/Handicrafts-Fair-concludes-with-business-of-Rs-100-million.jpg" alt="Handicrafts" />
                </div>
            </section>
        </div>
    );
};

export default Home;
