import "./App.css";

import Signup from "./component/signup";
import { Routes, Route, useLocation, Navigate, useParams } from "react-router-dom";
import Login from "./component/login";
import Footer from "./component/footer";
import Navbar from "./component/navbar";
import Home from "./component/home";
import MaleFashion from "./component/maleFashion";
import KidsFashion from "./component/kidsFashion";
import FemaleFashion from "./component/femaleFashion";
import DressDetails from "./component/dressDetails";
import FinalizePurchase from "./component/finalizePurchase";
import Messages from "./component/messages";
import Categories from "./component/categories";
import BecomeASeller from "./component/becomeASeller";
import About from "./component/about";
import Sustainability from "./component/sustainability";
import Terms from "./component/terms";
import Privacy from "./component/privacy";
import ContactUs from "./component/contactUs";
import Help from "./component/help";
import Notification from "./component/notification";
import SellerVerification from "./component/sellerVerification";
import ForgotPassword from "./component/forgotPassword";
import Profile from "./component/profile";
import SellerProfile from "./component/sellerProfile";
import SellerAddListing from "./component/sellerAddListing";
import AdminUserManagement from "./component/admin/AdminUserManagement";
import AdminSellerVerification from "./component/admin/AdminSellerVerification";
import AdminProductManagement from "./component/admin/AdminProductManagement";
import AdminResaleOrders from "./component/admin/AdminResaleOrders";
import AdminRentalOrders from "./component/admin/AdminRentalOrders";
import AdminCategoriesManagement from "./component/admin/AdminCategoriesManagement";

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

  const isAdminPage = location.pathname.startsWith("/admin");

  const mainClass = [
    "main-content",
    hideNavbar && !isAuthPage && "main-content--full-page",
    isAuthPage && "main-content--auth",
    isMessagesPage && "main-content--messages",
    isAdminPage && "main-content--admin",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`app-container${
        isMessagesPage ? " app-container--messages" : ""
      }`}
    >
      {!hideNavbar && !isAdminPage && <Navbar />}

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

          <Route path="/sellerVerification" element={<SellerVerification />} />
          <Route path="/sellerProfile" element={<SellerProfile />} />
          <Route
            path="/sellerDashboard"
            element={<Navigate to="/sellerProfile" replace />}
          />
          <Route
            path="/myListing"
            element={<Navigate to="/sellerProfile?section=listings" replace />}
          />
          <Route path="/addListing" element={<SellerAddListing />} />
          <Route
            path="/ordersRequests"
            element={<Navigate to="/sellerProfile?section=orders" replace />}
          />
          <Route
            path="/supportCenter"
            element={<Navigate to="/sellerProfile?section=support" replace />}
          />
          <Route
            path="/settings"
            element={<Navigate to="/sellerProfile" replace />}
          />

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

          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/admin/seller-verification" element={<AdminSellerVerification />} />
          <Route path="/admin/products" element={<AdminProductManagement />} />
          <Route path="/admin/resale-orders" element={<AdminResaleOrders />} />
          <Route path="/admin/rental-orders" element={<AdminRentalOrders />} />
          <Route path="/admin/categories" element={<AdminCategoriesManagement />} />
        </Routes>
      </main>

      {!isMessagesPage && !isAdminPage && <Footer />}
    </div>
  );
}

export default App;
