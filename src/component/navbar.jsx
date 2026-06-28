import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";
import {
  Heart,
  Bell,
  Menu,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userType = sessionStorage.getItem("userType");
  const isSeller = userType === "seller";

  const isBuyerDashboard =
    location.pathname === "/profile" || location.pathname === "/wishlist";
  const isSellerDashboard =
    location.pathname === "/sellerProfile" ||
    location.pathname === "/addListing";

  const showBuyerMenu = !isSeller;
  const showSellerMenu = isSeller;

  const handleBuyerMenuClick = () => {
    navigate(isBuyerDashboard ? "/home" : "/profile");
  };

  const handleSellerMenuClick = () => {
    navigate(isSellerDashboard ? "/home" : "/sellerProfile");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-start">
          {showBuyerMenu && (
            <Button
              type="button"
              variant="icon"
              size="icon"
              className={`navbar-menu-btn ${
                isBuyerDashboard ? "navbar-menu-btn--active" : ""
              }`}
              aria-label={
                isBuyerDashboard
                  ? "Close buyer dashboard"
                  : "Open buyer dashboard"
              }
              aria-expanded={isBuyerDashboard}
              onClick={handleBuyerMenuClick}
            >
              <Menu size={22} />
            </Button>
          )}
          {showSellerMenu && (
            <Button
              type="button"
              variant="icon"
              size="icon"
              className={`navbar-menu-btn ${
                isSellerDashboard ? "navbar-menu-btn--active" : ""
              }`}
              aria-label={
                isSellerDashboard
                  ? "Close seller dashboard"
                  : "Open seller dashboard"
              }
              aria-expanded={isSellerDashboard}
              onClick={handleSellerMenuClick}
            >
              <Menu size={22} />
            </Button>
          )}
          <Link to="/home" className="logo">
            Relux Hub
          </Link>
        </div>

        <ul className="navlinks">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/categories">Categories</Link>
          </li>
          <li>
            <Link to="/becomeASeller">Become a Seller</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>

        <div className="nav-right">
          <div className="nav-icons">
            <Link to="/messages" aria-label="Messages">
              <MessageCircle size={22} />
            </Link>

            <Link to="/wishlist" aria-label="Wishlist">
              <Heart size={22} />
            </Link>

            <Link to="/notification" aria-label="Notifications">
              <Bell size={22} />
            </Link>
          </div>

          <Link to="/signup" className="signup-btn">
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
