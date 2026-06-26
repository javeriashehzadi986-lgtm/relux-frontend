import React from "react";
import SellerSupportCenter from "./sellerSupportCenter";
import "./profileSupportCenter.css";

const ProfileSupportCenter = () => {
  return (
    <section className="profile-support-center">
      <header className="profile-support-center-header">
        <h1 className="profile-support-center-title">Support Center</h1>
        <p className="profile-support-center-subtitle">
          Get help or report issues related to your orders and rentals.
        </p>
      </header>
      <SellerSupportCenter variant="buyer" />
    </section>
  );
};

export default ProfileSupportCenter;
