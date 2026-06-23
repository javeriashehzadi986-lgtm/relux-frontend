import React from 'react'
import { Link } from 'react-router-dom'
import "./navbar.css";
import { ShoppingCart, Bell } from "lucide-react"

const Navbar = () => {
    return (
        <nav className='navbar'>
            <div className="navbar-inner">
            <Link to="/home" className="logo">Relux Hub</Link>
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
            <button className='signup-btn'><Link to="/signup"> Sign up</Link></button>
            </div>
            </div>
        </nav>
    )
}

export default Navbar
