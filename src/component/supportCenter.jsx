import React from "react";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SellerDashboardLayout from "./sellerDashboardLayout";
import SupportCenterContent from "./supportCenterContent";
import "./sellerDashboard.css";

const SupportCenter = () => {
  return (
    <SellerDashboardLayout active="support">
      <CardHeader className="seller-dashboard-heading px-0">
        <CardTitle className="seller-dashboard-page-title">
          Support Center
        </CardTitle>
        <CardDescription>
          Get help or report issues related to your clothing listings.
        </CardDescription>
      </CardHeader>

      <SupportCenterContent variant="seller" />
    </SellerDashboardLayout>
  );
};

export default SupportCenter;
