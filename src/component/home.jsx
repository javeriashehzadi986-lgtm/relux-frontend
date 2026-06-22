import React from "react";
import { Link } from "react-router-dom";
import { ClipboardList, CalendarDays, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import "./home.css";

const categories = [
  {
    title: "Bridal Wear",
    subtitle: "Majestic & Timeless",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCIqICAYYoVtfdiloBaEge9TZXU6GxClxvrCIF59fVDxQ4GeaEQztFo3OV8ka3Unk9GLy_GrnYkNmQAkyGkQ3lz6nbLKo4DFubUzwbwaf99Pz0DUuHaV1Mn7KAxbF0DmnPRjjgiKGzefhNK09KB-zGxQ0Dt3CMnY2haxXImcF_r9vRT5LCTaedkhLCIQj-R_Wtva-7jjAsyCc0kwbAXkZnvfsH2MqjDDxqH8RkwoV7CWKj8yrjirQRh_a_3MMcbIT2c870ZiwFnOO8o",
  },
  {
    title: "Party Wear",
    subtitle: "Chic & Glamorous",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPv4v1nlt_b3sPdaUowyoCjAlDvTMnu-IOkCLAW67eAuLKaNFGVMUMCapiqEhdMbMVpsUKYsW0W7Z_q0WcPyAgAiL9kNgXeQ4ZxkU5Ki8rucHFn5tGvy-EdrQsn59GuzuuiVxAqP30JUxkNHQM0O2Xc3dvtF29_EvFN2zAiHfXm17EhDGdswsEOMixdJFgLRBcXenDBSzJ-Mhgr7PDoCI2mq_vIyE9kojqfOwJND-bfrhh7rQI9-CweCZDCUnC6xHCtADsZISYzAgd",
  },
  {
    title: "Casual Used Clothes",
    subtitle: "Elegant & Comfortable",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATWKffXyZAtQsExY5-vJqikzxc1s0r5e74vGCGhzQZw-GPQTt0c_Cmh7IrttkPO3he03GV3Y8Q_H6P6HDSA_mjE9oG3YpqddKj8YnlzAMz96DVV6m0hA9vGvJVFrP-IPuYpA94Y5TCQRwUcGFeG01cHE1mZ6ojcyQTETTMDzMZRKeYFnb3UGdSFWy3nW1ObtpVIwJhdIbgAFZFqNDGjerBtGhmvjVQvKmic_WPXFSGAljHqDUTD1o34uw3mxYbgz93vILXOQU08FjL",
  },
];

const featuredRentals = [
  {
    title: "Ruby Bridal Lehenga",
    price: "Rs. 15,000 / day",
    badge: "New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAnpnhYMlgA_Esra7XWpFq4a9Dp6bNa4vmQGbsG8SH6VuI6yuwGx7SiQwtKwwlY41P76VNMka8e2ySxnLCp1xfh4NqrQCfMgLvJgLk40GLxOAv7p6XMnIaIgRXjcgDyFXACGYEFzTxM-nvX7c8dvWA6s75RuJIdSuLTUElrmKPzS8FhJkxyy110iGGTJlGj16XFgUf2AwCaBmx06CX-GBf2L1CKDFrioehOHZFsi1joiVtj3bTMB3fOepPQ9JWEmZNgW2oyOvSLqtgN",
  },
  {
    title: "Emerald Silk Pishwas",
    price: "Rs. 8,500 / day",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByc49fQ6wjxgD8ceWJqN_7RuyOyVxucnOSfvJPp6UoJC9T-1F6ATFC40ugr1e6LQVl1wU-lmLDkPQNAxX43V14bFeHDj8aFykUF_Ter9qxVn0Alwg7AhUompE5lNKoqGqyonj8youULKl4augSOXc3VyjtRu7d-v6CoR4PWBCBY3eWsaUaPpzfWf2zAYHMph2Se9KlpreaPy424J9Vpq4Rn6tqfT7tBEyUTISrq6_7o9pKSg2Ywq1z2ai5fLf1QjbztNKkKOZ_39ps",
  },
  {
    title: "Champagne Sequin Saree",
    price: "Rs. 6,000 / day",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGZ34R6RVKNDLns9guN33XbHPyS2jh7IWlbi0_7Z1n_KqaE8k_-K8IcN29zKTkTE1VBkAwNMGq4acmZ08WJuSCSnbDFndnwKEativTJYIHz6Aa8pc56Q0LfQZ-PywOma8sK8_Xt6anSdBaCtFulSPzMvzgUaW5x30n3euSqZZtXfcvCj4RED7Aj5zt1U4PbduAM4-Zf_erV8H4y6zeayA1Y3gwPphX_mQHShxEJfgE-l8I4foD3g6so6BX2PBu34_iTzppQuknSUDL",
  },
  {
    title: "Dusty Rose Ensemble",
    price: "Rs. 4,500 / day",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD3TOfcZkuzUXY48CyaozTsB3n0KBzn640SYX5edkuHd1cGKdD9ikSMMTGFZ1x75LX9bTarT5HGaRvmiXXoqOxBjmXBL0uPwTvAtvAYccTQGPvmBVtcEkOS8sX6QOM38mUAdmQn9I39D1fCfID6YJ9tN0IKFqRdeKYCEUVrmklPxb0fZbTKXjnh5y6AgB0JzNIapaouOVnzL4G0UX9k6NdqxRanXzFPR2cCz5ESzMxeXQuf4HlEKA1MnrJxENn5S1foqdF9I1l87E9P",
  },
];

const steps = [
  {
    icon: ClipboardList,
    iconClass: "green",
    title: "Choose Dress",
    description:
      "Browse our curated collection of designer pieces and select your favorite look for the event.",
  },
  {
    icon: CalendarDays,
    iconClass: "pink",
    title: "Rent for Event",
    description:
      "Book for your specific dates. We offer flexible rental periods to suit your schedule.",
  },
  {
    icon: RotateCcw,
    iconClass: "yellow",
    title: "Return After Use",
    description:
      "Drop it back or we'll pick it up. Don't worry about cleaning—we handle the dry cleaning for you.",
  },
];

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero */}
      <section className="home-hero">
        <img
          alt="Designer Pakistani Bridal Wear"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfX3jgFevQQ19fVVSBN-PEVzjpHJjJFZISihrsL3P79alPIyN5hk5Fdlv2vqoNwYefzuPWXxNL6hJ7BLGNpj3y7f2FYSDSLKPeuMxRHs__qhLr_1Oxm4WikJomKqKD3xWyGGqhuDsOXQ26jrrcy4Mw3GzmMZDa4HZinG7_lwN5lTJVPCqlOE31JXLJmsMh0X8n13gKei02-egcQ-s2bV6aifTqJ2_c9ds1iHYIqxSJV_bxcnu3jM1SoABEqd9TPshQHm4vJffYsQ6y"
        />
        <div className="home-hero-overlay">
          <div className="home-hero-content">
            <span className="home-hero-label">The Atelier Collection</span>
            <h1>Rent Designer Dresses in Pakistan</h1>
            <p>
              Affordable rentals for bridal and party wear. Experience high-end
              fashion without the designer price tag.
            </p>
            <Button size="lg" asChild>
              <Link to="/rentDresses">Explore Dresses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="home-section">
        <div className="home-section-header">
          <h2>Curated Categories</h2>
          <p>Finest selections for every occasion</p>
        </div>
        <div className="home-categories-grid">
          {categories.map((category) => (
            <Link
              key={category.title}
              to="/categories"
              className="home-category-card"
            >
              <Card className="home-category-shadcn-card">
                <div className="home-category-image">
                  <img alt={category.title} src={category.image} />
                </div>
                <CardContent className="home-category-card-content">
                  <CardTitle className="home-category-title">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="home-category-subtitle">
                    {category.subtitle}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Rentals */}
      <section className="home-section-alt">
        <div className="home-section-inner">
          <div className="home-section-header-center">
            <h2>Featured Rentals</h2>
            <p>Our most coveted pieces of the season</p>
          </div>
          <div className="home-products-grid">
            {featuredRentals.map((product) => (
              <Card key={product.title} className="home-product-card">
                <div className="home-product-image">
                  <img alt={product.title} src={product.image} />
                  {product.badge && (
                    <span className="home-product-badge">{product.badge}</span>
                  )}
                </div>
                <CardContent className="home-product-body">
                  <CardTitle className="home-product-title">
                    {product.title}
                  </CardTitle>
                  <p className="home-product-price">{product.price}</p>
                  <Button variant="outline" size="full">
                    Rent Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="home-section">
        <div className="home-section-header-center">
          <h2>Simple. Seamless. Stylish.</h2>
        </div>
        <div className="home-steps-grid">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className="home-step-card">
                <CardContent className="home-step-card-content">
                  <div className={`home-step-icon ${step.iconClass}`}>
                    <Icon size={32} />
                  </div>
                  <CardTitle className="home-step-title">{step.title}</CardTitle>
                  <CardDescription className="home-step-description">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Seller Banner */}
      <section className="home-section">
        <div className="home-seller-banner">
          <div className="home-seller-content">
            <h2>Earn by Renting Your Dresses</h2>
            <p>
              Give your expensive designer outfits a new life. Join our community
              of sustainable fashionistas and earn from your wardrobe.
            </p>
            <Button variant="light" size="lg" asChild>
              <Link to="/becomeASeller">Become a Seller</Link>
            </Button>
          </div>
          <div className="home-seller-image">
            <img
              alt="Seller wardrobe"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKXlnZaiVOYW0sDBWOr-K9oIe3EbunycifjFB94bXJHON3GjLkQPV0juMgoWEe1e1ROgwPcshrTayvzn4irNGDdjU9AYmU8szOBAgkg-kvJUv4CJOUsP3oihipI5qx80p0EVInEY77ZyOeI0qTYO-5vPaXq_5pO6IzTbmSm6-WeDWcMk8glQ2Nvb9QGpgG4eASVqtwM-4flTdRc6bFHJDjA5heNlhQezG8zGO4GK8CbC3NRDWvJ_djGrTPZH7OpJCQLCQUZNOUwBo3"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
