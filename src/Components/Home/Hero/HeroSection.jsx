import React from "react";
import "./HeroSection.css";
import { Link } from "react-router-dom";
import heroVideo from "../../Home/../../Assets/hero.mp4";
const HeroSection = () => {
  return (
    <section className="hero">
      {/* Background Video */}
      
<video
  className="heroVideo"
  autoPlay
  loop
  muted
  playsInline
>
  <source src={heroVideo} type="video/mp4" />
</video>

      {/* Overlay */}
      <div className="heroOverlay"></div>

      {/* Content */}
      <div className="heroContent">
        <h1>
          Riding <br /> reinvented
        </h1>
        <p>Meet the e-bike that thinks for itself.</p>

        <Link to="/shop" className="heroBtn">
          Discover Cruiser
        </Link>

        <div className="heroFeatures">
          <span>🏆 Award-winning design</span>
          <span>⚡ Natural ride feel</span>
          <span>🔒 Theft protection 24/7</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
