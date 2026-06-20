import { useState } from 'react'
import './App.css'
import Signup from './component/signup'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './component/login'
import Footer from './component/footer';
import Navbar from './component/navbar';
import Home from './component/home';
import RentDresses from './component/rentDresses';
import Preowned from './component/pre-owned';
import Categories from './component/categories';
import BecomeASeller from './component/becomeASeller';
import About from './component/about';
import Sustainability  from './component/sustainability';
import Terms from './component/terms';
import Privacy from './component/privacy';
import ContactUs from './component/contactUs';


function App() {
  return (
    <>
    <div className="app-container">
    <Navbar />
<main className="main-content">
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/becomeASeller" element={<BecomeASeller />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/pre-owned" element={<Preowned />} />
        <Route path="/rentDresses" element={<RentDresses />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy/>} />
        <Route path="/contactUs" element={<ContactUs/>} />

      </Routes>
      </main>
      <Footer/>
      </div>
    </>
    )
}

export default App
