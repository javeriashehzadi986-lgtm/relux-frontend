import React from 'react'
import { Link } from 'react-router-dom'
import "./navbar.css";
import { ShoppingCart, Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button";

const Navbar = () => {
    return (
        <nav className='navbar'>
            <div className="navbar-inner">
            <div className="navbar-start">
            <Button
              type="button"
              variant="icon"
              size="icon"
              className="navbar-menu-btn"
              asChild
            >
              <Link to="/profile" aria-label="Open profile">
                <Menu size={22} />
              </Link>
            </Button>
            <Link to="/home" className="logo">Relux Hub</Link>
            </div>
            <ul className='navlinks'>
                <li> <Link to="/home">Home  </Link> </li>
                <li><Link to="/rentDresses">Rent Dresses</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/becomeASeller">Become a Seller</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>
            <div className='nav-right'>
            <div className='nav-icons'>
                <Link to="/cart"> <ShoppingCart size={22} /> </Link>

                <Link to="/notification"> <Bell size={22} /> </Link>
            </div>
            <Link to="/signup" className="signup-btn">
              Sign up
            </Link>
            </div>
            </div>
        </nav>
    )
}

export default Navbar
