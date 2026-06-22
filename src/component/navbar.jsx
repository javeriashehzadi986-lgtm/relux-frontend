import React from 'react'
import { Link } from 'react-router-dom'
import "./navbar.css";
import { ShoppingCart, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

const Navbar = () => {
    return (
        <nav className='navbar'>
            <h1 className='logo'> Relux Hub</h1>
            <ul className='navlinks'>
                <li> <Link to="/home">Home  </Link> </li>
                <li><Link to="/rentDresses">Rent Dresses</Link></li>
                <li><Link to="/pre-owned">Pre-owned</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/becomeASeller">Become a seller</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>
            <div className='nav-right'>
            <div className='nav-icons'>
                <Link to="/cart"> <ShoppingCart size={22} /> </Link>

                <Link to="/notification"> <Bell size={22} /> </Link>
            </div>
            <Button asChild size="sm" variant="secondary" className="nav-login-btn">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/signup">Sign up</Link>
            </Button>
            </div>
        </nav>
    )
}

export default Navbar
