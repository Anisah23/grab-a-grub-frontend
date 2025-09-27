import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './Home.css';

const Home = () => {
  const { user } = useUser();

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Discover & Share Amazing Recipes</h1>
            <p>Join our community of food lovers and explore thousands of delicious recipes from around the world.</p>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-large">
                Explore Recipes <i className="fas fa-arrow-right"></i>
              </Link>
            ) : (
              <div className="hero-buttons">
                <Link to="/signup" className="btn btn-primary btn-large">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-secondary btn-large">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose Grab a Grub?</h2>
          <div className="features-grid">
            <div className="feature">
              <i className="fas fa-share-alt"></i>
              <h3>Share Recipes</h3>
              <p>Share your culinary creations with the community</p>
            </div>
            <div className="feature">
              <i className="fas fa-heart"></i>
              <h3>Save Favorites</h3>
              <p>Keep track of your favorite recipes</p>
            </div>
            <div className="feature">
              <i className="fas fa-comments"></i>
              <h3>Get Feedback</h3>
              <p>Receive comments and likes on your recipes</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;