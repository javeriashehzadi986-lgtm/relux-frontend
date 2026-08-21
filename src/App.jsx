import "./App.css";

import Signup from "./component/signup";
import { Routes, Route, useLocation, Navigate, useParams } from "react-router-dom";
import Login from "./component/login";
import Footer from "./component/footer";
import Navbar from "./component/navbar";
import Home from "./component/home";
import MaleFashion from "./component/maleFashion";
import KidsFashion from "./component/kidsFashion";
import FemaleFashion, { CategoryFashion } from "./component/femaleFashion";
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
import NotificationDetail from "./component/notificationDetail";
import SellerVerification from "./component/sellerVerification";
import ForgotPassword from "./component/forgotPassword";
import Profile from "./component/profile";
import SellerProfile from "./component/sellerProfile";
import SellerAddListing from "./component/sellerAddListing";
import SellerPending from "./component/sellerPending";
import SellerRejected from "./component/sellerRejected";
import AdminLayout from "./component/admin/AdminLayout";
import AdminProfile from "./component/admin/adminProfile";
import AdminReviews from "./component/admin/adminReviews";
import AdminSupportCenter from "./component/admin/adminSupportCenter";
import AdminNotifications from "./component/admin/adminNotifications";
import AdminPayments from "./component/admin/adminPayments";
import AdminContactMessages from "./component/admin/AdminContactMessages";
import AdminUserManagement from "./component/admin/AdminUserManagement";
import AdminSellerVerification from "./component/admin/AdminSellerVerification";
import AdminProductManagement from "./component/admin/AdminProductManagement";
import AdminResaleOrders from "./component/admin/AdminResaleOrders";
import AdminRentalOrders from "./component/admin/AdminRentalOrders";
import AdminCategoriesManagement from "./component/admin/AdminCategoriesManagement";
import ProtectedRoute from "./routes/ProtectedRoute";
import SellerRoute from "./routes/SellerRoute";
import WishlistRoute from "./routes/WishlistRoute";

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
          <Route path="/category/:slug" element={<CategoryFashion />} />
          <Route path="/maleFashion" element={<MaleFashion />} />
          <Route path="/kidsFashion" element={<KidsFashion />} />
          <Route path="/femaleFashion" element={<FemaleFashion />} />
          <Route path="/dress/:id" element={<DressDetails />} />
          <Route path="/dress/:id/checkout" element={<FinalizePurchase />} />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/:conversationId"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route path="/dress/:id/chat" element={<DressChatRedirect />} />
          <Route path="/becomeASeller" element={<BecomeASeller />} />

          <Route path="/sellerVerification" element={<SellerVerification />} />
          <Route
            path="/seller-pending"
            element={
              <ProtectedRoute roles={["seller"]}>
                <SellerPending />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller-rejected"
            element={
              <ProtectedRoute roles={["seller"]}>
                <SellerRejected />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sellerProfile"
            element={
              <SellerRoute>
                <SellerProfile />
              </SellerRoute>
            }
          />
          <Route
            path="/sellerDashboard"
            element={<Navigate to="/sellerProfile" replace />}
          />
          <Route
            path="/myListing"
            element={<Navigate to="/sellerProfile?section=listings" replace />}
          />
          <Route
            path="/addListing"
            element={
              <SellerRoute>
                <SellerAddListing />
              </SellerRoute>
            }
          />
          <Route
            path="/ordersRequests"
            element={<Navigate to="/sellerProfile?section=orders" replace />}
          />
          <Route
            path="/supportCenter"
            element={<Navigate to="/sellerProfile?section=support" replace />}
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={["buyer"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistRoute />
              </ProtectedRoute>
            }
          />

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/help" element={<Help />} />

          <Route path="/cart" element={<Navigate to="/wishlist" replace />} />
          <Route
            path="/notification"
            element={
              <ProtectedRoute>
                <Notification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notification/:id"
            element={
              <ProtectedRoute>
                <NotificationDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/adminProfile" element={<Navigate to="/admin/profile" replace />} />
          <Route path="/adminReviews" element={<Navigate to="/admin/reviews" replace />} />
          <Route path="/adminSupportCenter" element={<Navigate to="/admin/support" replace />} />
          <Route path="/adminNotifications" element={<Navigate to="/admin/notifications" replace />} />
          <Route path="/adminPayments" element={<Navigate to="/admin/payments" replace />} />
          <Route
            path="/adminReportsComplaints"
            element={<Navigate to="/admin/support" replace />}
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/profile" replace />} />
            <Route path="users" element={<AdminUserManagement />} />
            <Route path="seller-verification" element={<AdminSellerVerification />} />
            <Route path="products" element={<AdminProductManagement />} />
            <Route path="categories" element={<AdminCategoriesManagement />} />
            <Route path="resale-orders" element={<AdminResaleOrders />} />
            <Route path="rental-orders" element={<AdminRentalOrders />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="contact" element={<AdminContactMessages />} />
            <Route path="support" element={<AdminSupportCenter />} />
            <Route path="reports" element={<Navigate to="/admin/support" replace />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Routes>
      </main>

      {!isMessagesPage && !isAdminPage && <Footer />}
    </div>
  );
}

export default App;
