import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <Link to="/home" className="footer-logo">
          Relux Hub
        </Link>
        <p>Relux Hub. Curating Timeless Elegance.</p>
      </div>

      <div className="footer-right">
        <Link to="/sustainability">Sustainability</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/contactUs">ContactUs</Link>
        <Link to="/help">Help</Link>
      </div>
    </footer>
  );
};

export default Footer;
