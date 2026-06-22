import './App.css'
import Signup from './component/signup'
import { Routes, Route, useLocation } from "react-router-dom";
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
import Cart from './component/cart';
import Notification from './component/notification';

const AUTH_ROUTES = ["/login", "/signup"];

function App() {
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);
  const isSustainabilityPage = location.pathname === "/sustainability";
  const hideNavbar = isAuthPage || isSustainabilityPage;

  const containerClass = [
    "app-container",
    isAuthPage ? "app-container--auth" : "",
    isSustainabilityPage ? "app-container--sustainability" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const mainClass = [
    "main-content",
    isAuthPage ? "main-content--auth" : "",
    isSustainabilityPage ? "main-content--sustainability" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClass}>
      {!hideNavbar && <Navbar />}
      <main className={mainClass}>
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
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/notification" element={<Notification />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App
