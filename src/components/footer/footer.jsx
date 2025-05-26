import './Footer.css';

const Footer = () => {
    return (
        <>
            <footer className="footer">
                <div className="footer-content">
                    <p>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
                    <div className="social-links">
                        <a href="#">Twitter</a>
                        <a href="#">Facebook</a>
                        <a href="#">Instagram</a>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;