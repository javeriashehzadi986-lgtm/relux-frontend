import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  getSellerApplicationPath,
  getSellerSignupState,
} from "@/utils/authRedirect";
import {
  UserPlus,
  HelpCircle,
  ClipboardCheck,
  IdCard,
  ShieldCheck,
  Landmark,
  Camera,
  Scale,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import "./becomeASeller.css";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDV2uUM9Hk2lOjJMIFUr5ECIdEt3UD6uRaBt1KE2k3Ygi6pu19qp8qB40HC6AJVLzcHUwpuiRRVXoaqc5iimaXWcE55lI0NSBKqUQDXm2-WBrsvvWdU-SYPCBG35-mUi4fk8l76sTNVIP5ygkdnXFIRcD2kthSiGeDOFz_hmLvCn7BU4AIcFZTVrUpsJl2W9AK3Y0YaSqJjNdbeocsp0Ac0idwPhmBmlMfGJahWSFRQDwf5kgQtnxm461paZW8nN77Bovp32e-sirOM";

const COLLECTION_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCj7U7npU7KbF6yuy6D_G8rXxlt27xsraIyTfYEVJSp6NPGy2g5PVVF2WeFfahNE0GjM0XvRWWj-UHUTzDL0Y-vEgK2VhkHy9ogiQCjw_tyzyy0jS4oJp55n0bU27CfhgShk-cebHGe2Ydr-ZIOEfPnGIJG0mpJsIJrPLxysoC47zuim95EtP-_YZrAUJz2sLTyZSOml0Q-BptZjBPo8wtr-WUV4YZTD7ww5BbfZWhGXQ8sVKnsPWucHhLY0-1Y4SZTWQoq1wsHkiHd";

const FINAL_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAvXOxbNZwRLue7Cd1vXDegniMlrooj1hUjrCA4xXc0mACNn8sN7pWgQKG_mwbq6SeFPbqepII1ArI-qTLsnN677JA6m1B2DPklI-yCarg1SMIPCAsLTNuG9AXc_bfkO1r7NwXySjpuvOWPzheJdPg114JnKnWd5Lk8x6pKYoogmK9uxcGD6kFiy4UuV4T-7LhWlaVuhNUt8W34wMh5TLgtOESOJ0WHmxfbxQxqW7eH1FUmRbB0GoaaK6qjCmZhGCWi_Phhi7Dsj0iz";

const sidebarLinks = [
  {
    id: "become",
    label: "Become a Seller",
    icon: UserPlus,
    to: "/sellerVerification",
    active: true,
  },
  { id: "help", label: "Help Center", icon: HelpCircle, to: "/help" },
];

const requirements = [
  {
    icon: IdCard,
    title: "Valid CNIC/ID",
    description: "Official government identification for security.",
  },
  {
    icon: ShieldCheck,
    title: "Mobile/Email verification",
    description: "Active contact points for order notifications.",
  },
  {
    icon: Landmark,
    title: "Bank account details",
    description: "Secure IBAN for weekly earning payouts.",
  },
  {
    icon: Camera,
    title: "High-quality images",
    description: "Front, back, and detail shots on a neutral background.",
  },
  {
    icon: ClipboardList,
    title: "Dress description",
    description: "Accurate fabric, size, condition, and rental price.",
  },
  {
    icon: Scale,
    title: "Security & Policy",
    description: "Agreement to deposit rules and rental terms.",
  },
];

const journeySteps = [
  {
    step: "01",
    title: "Register as Seller",
    description: "Complete your profile and link your payout account.",
  },
  {
    step: "02",
    title: "Upload Dresses",
    description: "List your designer pieces with stunning imagery.",
  },
  {
    step: "03",
    title: "Get Verified",
    description: "Our curators review each listing for quality assurance.",
  },
  {
    step: "04",
    title: "Start Receiving Orders",
    description: "Relax as your pieces earn while being managed by us.",
  },
];

const BecomeASeller = () => {
  const { isAuthenticated, loading } = useAuth();
  const sellerApplyPath = getSellerApplicationPath(isAuthenticated && !loading);
  const sellerApplyState = isAuthenticated ? undefined : getSellerSignupState();

  return (
    <div className="seller-page">
      <section className="seller-hero-section">
        <div className="seller-hero">
          <img
            className="seller-hero-image"
            alt="Premium Bridal Wear"
            src={HERO_IMAGE}
          />
          <div className="seller-hero-overlay">
            <span className="seller-hero-badge">Partner Program</span>
            <h1>
              The Atelier for
              <br />
              Rentals
            </h1>
            <p>Turn your premium wardrobe into a luxury business.</p>
          </div>
        </div>
      </section>

      <div className="seller-layout">
        <aside className="seller-sidebar">
          <div className="seller-sidebar-inner">
            <div className="seller-sidebar-nav">
              <h3>Seller Portal</h3>
              <ul className="seller-sidebar-links">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const to = link.id === "become" ? sellerApplyPath : link.to;
                  const state = link.id === "become" ? sellerApplyState : undefined;
                  return (
                    <li key={link.id}>
                      <Button
                        asChild
                        variant="ghost"
                        className={`seller-sidebar-link ${
                          link.active ? "is-active" : ""
                        }`}
                      >
                        <Link to={to} state={state}>
                          <Icon size={20} />
                          {link.label}
                        </Link>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <Card className="seller-testimonial-card py-0 gap-0 ring-0 shadow-none">
              <CardContent className="seller-testimonial-content">
                <p className="seller-testimonial-quote">
                  &ldquo;Joining Relux Hub transformed how I manage my high-end
                  collection. The process is seamless and the community is
                  exquisite.&rdquo;
                </p>
                <p className="seller-testimonial-author">
                  — Zara K., Premier Seller
                </p>
              </CardContent>
            </Card>
          </div>
        </aside>

        <div className="seller-main">
          <Card className="seller-intro-card py-0 gap-0 ring-0">
            <CardContent className="seller-intro-content">
              <div className="seller-intro-copy">
                <CardTitle className="seller-intro-title">
                  Start Selling with Relux Hub
                </CardTitle>
                <CardDescription className="seller-intro-text">
                  Join our premium designer marketplace and rent out your luxury
                  outfits. We connect you with fashion enthusiasts looking for
                  high-end experiences while ensuring your garments are handled
                  with professional care.
                </CardDescription>
                <Button type="button" size="lg" className="seller-apply-btn" asChild>
                  <Link to={sellerApplyPath} state={sellerApplyState}>
                    Apply as Seller
                  </Link>
                </Button>
              </div>
              <div className="seller-intro-image-wrap">
                <img
                  alt="Luxury Designer Dress Collection"
                  src={COLLECTION_IMAGE}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="seller-requirements-card py-0 gap-0 ring-0 shadow-none">
            <CardContent className="seller-requirements-content">
              <div className="seller-requirements-header">
                <div className="seller-requirements-heading">
                  <CardTitle className="seller-requirements-title">
                    Registration Requirements
                  </CardTitle>
                  <CardDescription className="seller-requirements-subtitle">
                    Before applying, ensure you have the following documentation
                    ready to speed up your verification process.
                  </CardDescription>
                </div>
                <ClipboardCheck
                  className="seller-requirements-icon"
                  size={72}
                  strokeWidth={1}
                  aria-hidden="true"
                />
              </div>

              <div className="seller-requirements-grid">
                {requirements.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="seller-requirement-item">
                      <span className="seller-requirement-icon-wrap">
                        <Icon size={18} />
                      </span>
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <section className="seller-journey">
            <h3 className="seller-journey-title">The Journey to Premier Seller</h3>
            <div className="seller-journey-grid">
              {journeySteps.map((step) => (
                <Card
                  key={step.step}
                  className="seller-journey-card py-0 gap-0 ring-0 shadow-none"
                >
                  <CardContent className="seller-journey-card-content">
                    <span className="seller-journey-step">{step.step}</span>
                    <div>
                      <CardTitle className="seller-journey-card-title">
                        {step.title}
                      </CardTitle>
                      <CardDescription className="seller-journey-card-text">
                        {step.description}
                      </CardDescription>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <div className="seller-focus-image-wrap">
            <img
              className="seller-focus-image"
              alt="Elegant Silk"
              src={FINAL_IMAGE}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeASeller;
