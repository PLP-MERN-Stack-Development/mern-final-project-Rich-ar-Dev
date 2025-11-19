import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="forest-background"></div>
      <div className="home-content">
        <div className="hero-section">
          <h1>🌲 TaskFlow Pro</h1>
          <p>Collaborative Project Management Platform</p>
          <div className="cta-buttons">
            <Link to="/login" className="cta-btn primary">Login</Link>
            <Link to="/register" className="cta-btn secondary">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;