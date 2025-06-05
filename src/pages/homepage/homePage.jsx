import './homePage.css';

const Home = () => {
    return (
        <div className="home-container">
            <main className="main-content">
                <h1>Welcome to My React App</h1>
                <p>This is a modern React application with separate components.</p>
                <button className="cta-button">Get Started</button>
            </main>
        </div>
    );
};

export default Home;