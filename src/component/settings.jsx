import React from "react";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SellerDashboardLayout from "./sellerDashboardLayout";
import "./sellerDashboard.css";

const Settings = () => {
  return (
    <SellerDashboardLayout active="settings">
      <CardHeader className="seller-dashboard-heading px-0">
        <CardTitle className="seller-dashboard-page-title">Settings</CardTitle>
        <CardDescription>
          Manage your seller preferences and account settings.
        </CardDescription>
      </CardHeader>
    </SellerDashboardLayout>
  );
};

export default Settings;
