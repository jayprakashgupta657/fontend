import './about.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>About HandiCraft MarketPlace</h1>
        <p>Connecting artisans with art lovers since 2020</p>
      </div>

      <div className="about-content">
        <section className="about-section mission">
          <h2>Our Mission</h2>
          <p>
            At HandiCraft MarketPlace, we're committed to preserving and promoting traditional
            craftsmanship while providing artisans with a platform to showcase their unique creations
            to a global audience. We believe in supporting local communities and keeping ancient
            craft traditions alive in the modern world.
          </p>
        </section>

        <section className="about-section values">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <i className="fas fa-hands-helping"></i>
              <h3>Artisan Support</h3>
              <p>Empowering craftspeople by providing fair compensation and global exposure</p>
            </div>
            <div className="value-item">
              <i className="fas fa-leaf"></i>
              <h3>Sustainability</h3>
              <p>Promoting eco-friendly practices and sustainable materials</p>
            </div>
            <div className="value-item">
              <i className="fas fa-star"></i>
              <h3>Quality</h3>
              <p>Ensuring excellence in every handcrafted piece</p>
            </div>
            <div className="value-item">
              <i className="fas fa-users"></i>
              <h3>Community</h3>
              <p>Building connections between artisans and art enthusiasts</p>
            </div>
          </div>
        </section>

        <section className="about-section story">
          <h2>Our Story</h2>
          <div className="story-content">
            <div className="story-text">
              <p>
                Founded in 2020, HandiCraft MarketPlace began with a simple idea: to create a bridge
                between talented artisans and people who appreciate handmade crafts. What started
                as a small local initiative has grown into a thriving marketplace featuring
                artisans from various regions.
              </p>
              <p>
                Today, we work with over 100 skilled craftspeople, offering a diverse collection
                of handmade products ranging from traditional pottery and bamboo crafts to
                contemporary artwork and home decor.
              </p>
            </div>
            <div className="story-stats">
              <div className="stat-item">
                <span className="stat-number">100+</span>
                <span className="stat-label">Artisans</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Categories</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">10k+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section join">
          <h2>Join Our Journey</h2>
          <p>
            Whether you're an artisan looking to showcase your work or a craft enthusiast
            seeking unique handmade pieces, we invite you to be part of our growing community.
          </p>
          <div className="cta-buttons">
            <a href="/contact" className="cta-button primary">Contact Us</a>
            <a href="/products" className="cta-button secondary">Explore Products</a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;