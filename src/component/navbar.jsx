import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";
import {
  ShoppingCart,
  Heart,
  Bell,
  Menu,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();

  const showBuyerMenu =
    location.pathname === "/home" || location.pathname === "/profile";

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-start">
          {showBuyerMenu && (
            <Button
              type="button"
              variant="icon"
              size="icon"
              className="navbar-menu-btn"
              asChild
            >
              <Link to="/profile" aria-label="Open buyer dashboard">
                <Menu size={22} />
              </Link>
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
            <Link to="/rentDresses">Rent Dresses</Link>
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

            <Link to="/cart" aria-label="Cart">
              <ShoppingCart size={22} />
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
