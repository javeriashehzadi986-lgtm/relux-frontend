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
import Help from './component/help';

const HIDE_NAVBAR_ROUTES = ["/login", "/signup", "/sustainability", "/terms", "/privacy", "/contactUs", "/help"];
const AUTH_ROUTES = ["/login", "/signup"];
const FULL_PAGE_ROUTES = ["/sustainability", "/terms", "/privacy", "/contactUs", "/help"];

function App() {
  const { pathname } = useLocation();
  const hideNavbar = HIDE_NAVBAR_ROUTES.includes(pathname);
  const isAuthPage = AUTH_ROUTES.includes(pathname);
  const isFullPage = FULL_PAGE_ROUTES.includes(pathname);

  const containerClass = [
    "app-container",
    isAuthPage && "app-container--auth",
    isFullPage && "app-container--full-page",
  ]
    .filter(Boolean)
    .join(" ");

  const mainClass = [
    "main-content",
    isAuthPage && "main-content--auth",
    isFullPage && "main-content--full-page",
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
          <Route path="/help" element={<Help />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App
