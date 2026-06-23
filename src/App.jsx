import './App.css'
import Signup from './component/signup'
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from './component/login'
import Footer from './component/footer';
import Navbar from './component/navbar';
import Home from './component/home';
import RentDresses from './component/rentDresses';
import Preowned from './component/pre-owned';
import Categories from './component/categories';
import BecomeASeller from './component/becomeASeller';
import About from './component/about';
import Sustainability from './component/sustainability';
import Terms from './component/terms';
import Privacy from './component/privacy';
import ContactUs from './component/contactUs';
import Help from './component/help';
import Cart from './component/cart';
import Notification from './component/notification';
import SellerVerification from './component/sellerVerification';

function App() {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/sustainability",
    "/terms",
    "/privacy",
    "/contactUs",
    "/help",
    "/signup",
    "/login",
  ];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  const mainClass = [
    "main-content",
    hideNavbar && !isAuthPage && "main-content--full-page",
    isAuthPage && "main-content--auth",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="app-container">
      {!hideNavbar && <Navbar />}
      <main className={mainClass}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/becomeASeller" element={<BecomeASeller />} />
          <Route path="/sellerVerification" element={<SellerVerification />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/pre-owned" element={<Preowned />} />
          <Route path="/rentDresses" element={<RentDresses />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/help" element={<Help />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/notification" element={<Notification />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;