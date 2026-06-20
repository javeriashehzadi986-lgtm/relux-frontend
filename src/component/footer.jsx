import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <h2>Relux Hub</h2>
        <p>Relux Hub. Curating Timeless Elegance.</p>
      </div>

      <div className="footer-right">
        <Link to="/sustainability">Sustainability</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/contactUs">ContactUs</Link>
      </div>
    </footer>
  );
};

export default Footer;
