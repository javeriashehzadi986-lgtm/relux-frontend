import './App.css'
import Signup from './component/signup'
import { Routes, Route, useLocation, Navigate, useParams } from "react-router-dom";
import Login from './component/login'
import Footer from './component/footer';
import Navbar from './component/navbar';
import Home from './component/home';
import MaleFashion from './component/maleFashion';
import KidsFashion from './component/kidsFashion';
import FemaleFashion from './component/femaleFashion';
import DressDetails from './component/dressDetails';
import FinalizePurchase from './component/finalizePurchase';
import Messages from './component/messages';
import Categories from './component/categories';
import BecomeASeller from './component/becomeASeller';
import About from './component/about';
import Sustainability from './component/sustainability';
import Terms from './component/terms';
import Privacy from './component/privacy';
import ContactUs from './component/contactUs';
import Help from './component/help';
import Notification from './component/notification';
import SellerVerification from './component/sellerVerification';
import ForgotPassword from './component/forgotPassword';

import Profile from './component/profile';

import MyListing from './component/myListing';
import AddListing from './component/addListing';
import OrdersRequests from './component/ordersRequests';
import SellerProfile from './component/sellerProfile';
import SupportCenter from './component/supportCenter';
import Settings from './component/settings';

const DressChatRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/messages/${id}`} replace />;
};

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
    "/forgot-password",
  ];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password";

  const isMessagesPage = location.pathname.startsWith("/messages");

  const mainClass = [
    "main-content",
    hideNavbar && !isAuthPage && "main-content--full-page",
    isAuthPage && "main-content--auth",
    isMessagesPage && "main-content--messages",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`app-container${isMessagesPage ? " app-container--messages" : ""}`}>
      {!hideNavbar && <Navbar />}

      <main className={mainClass}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />

          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/rentDresses" element={<Navigate to="/categories" replace />} />
          <Route path="/maleFashion" element={<MaleFashion />} />
          <Route path="/kidsFashion" element={<KidsFashion />} />
          <Route path="/femaleFashion" element={<FemaleFashion />} />
          <Route path="/dress/:id" element={<DressDetails />} />
          <Route path="/dress/:id/checkout" element={<FinalizePurchase />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:conversationId" element={<Messages />} />
          <Route path="/dress/:id/chat" element={<DressChatRedirect />} />
          <Route path="/becomeASeller" element={<BecomeASeller />} />

          <Route path="/sellerVerification" element={<SellerVerification />}
          />

          <Route path="/sellerDashboard" element={<SellerProfile />}
          />

          <Route path="/sellerProfile" element={<Navigate to="/sellerDashboard" replace />}
          />

          <Route path="/myListing" element={<MyListing />} />
          <Route path="/addListing" element={<AddListing />} />
          <Route path="/ordersRequests" element={<OrdersRequests />} />
          <Route path="/supportCenter" element={<SupportCenter />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Profile section="wishlist" />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/help" element={<Help />} />

          <Route path="/cart" element={<Navigate to="/wishlist" replace />} />
          <Route path="/notification" element={<Notification />} />
        </Routes>
      </main>

      {!isMessagesPage && <Footer />}
    </div>
  );
}

export default App;