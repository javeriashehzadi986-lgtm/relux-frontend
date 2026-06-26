import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CloudUpload, Plus, X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "./sellerDashboard.css";
import "./sellerAddListing.css";

const clothingTypes = [
  "Select Type",
  "Dress",
  "Shirt",
  "Knitwear",
  "Outerwear",
  "Accessories",
];

const sizeOptions = ["XS", "S", "M", "L", "XL"];
const conditionOptions = ["Like New", "Good", "Fair"];

const previewThumbs = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAXxVIrbVCOCT82XNvkqWO0eEgioxMP5KllgqBRslb6p1K2vZG5_Al5fJ0WjpScR-NAIyW3SXOHm6WGzF2eEqHapcIqCMrJwzRgYJXTEXMBrf35OmZKCR64XYu0iC9vTZgRPFYwJXTh9_A_X_X4PEDUrmB3IYHftxGQ1MkknW6Cai6kwDxcX_3U9A-h9r2rNMbLE-VXd6Lj_biOHW-L3auwAj9iHsAJkA4Li7yl_SjiYQaQPEoRsFtv5fnSoUFkGjXP0Uq6bEpoQpqM",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAyf7vT5X2qY1XQN5M1ak9f1CLumy3HmE8vDUuKH1ZSPpQLqVL9CNIJi-ndKu3t34y1Aw7g6iDgmbzUB3E_6Q9aa4YEPgFMrBL24mpKEY1Og6AbAM45Wpb_aq9ii8m5e_B-vNnXMSPtW5OJZteQHiZRmc4UZIfeyCrsfPUjxD4tEVAuclonIO9ZrCepv-wCojgEjvGPYR3mElVemXHkJsg9tCwNYjJbL4volagWC56IXovbeXRvk03DwSeFzm08tNkWrKEO7mULoXIk",
];

const previewHero =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDlwhyF6SS6jajGCbROAAXC1Renqpw5TnYlrL6dFzceDZ_2kRwE9dNAibtUk6ZrRLJRn3XFwdfRfvnrZopuYbS_9CrCzgW27ZehzyZtZYbySZTlQ3TLxkhqozYHhZ4TJW8uwKxaR4guh0AMevUrs9qnhRc8Q6NqCoe6iEgZMqzcDQLfrzj6uZeAeNi951t7Es2AQ7B0kNgQZNpo6EjbVArqNB8M4HL1Np63Vf1XWcoN4XbyPD0V3keWBU9VirgS5BQ9FPRaaHI6mObD";

const sellerAvatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDyGJnM5y4jfBXKtcNuJxlOcnx-svsckJx4IBXueyqKrdSWM2hdBbjYXW9ULTgFvuDDjMiIkdeKwFw1CGFXRdx2-POSdMys1dLYfFWv0TqiR_S80yjHVwQY0gjuY9rns4zDRGLBLJ9CM997am3u4ki1hxgMDDG0CgUrFpoSOai4bJiJDq5Uc7fz-gtM0UYOrnpJO51zYCTNFAxJILA4DSC2uGczqhHctdvgaZUzLK2HEXgI6moIjb9RBs4DUOg9nO3QkvfB3LsNLVUT";

function ChipGroup({ options, value, onChange }) {
  return (
    <div className="add-listing-chips">
      {options.map((option) => (
        <Button
          key={option}
          type="button"
          variant="outline"
          className={`add-listing-chip ${
            value === option ? "is-active" : ""
          }`}
          onClick={() => onChange(option)}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}

const SellerAddListing = () => {
  const navigate = useNavigate();
  const [listingType, setListingType] = useState("sale");
  const [biddingEnabled, setBiddingEnabled] = useState(false);
  const [size, setSize] = useState("S");
  const [condition, setCondition] = useState("Like New");
  const [title, setTitle] = useState("");
  const [clothingType, setClothingType] = useState("Dress");
  const [description, setDescription] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [auctionEndDate, setAuctionEndDate] = useState("");
  const [rentPrice, setRentPrice] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");

  const previewTitle = title.trim() || "Silk Midi Dress";
  const previewPrice =
    listingType === "sale"
      ? salePrice
        ? `$${salePrice}`
        : "$450"
      : rentPrice
        ? `$${rentPrice} / day`
        : "$45 / day";

  const goToListings = () =>
    navigate("/sellerProfile", { state: { section: "listings" } });

  const handlePublish = (event) => {
    event.preventDefault();
    goToListings();
  };

  return (
    <div className="add-listing-page">
        <header className="add-listing-header">
          <h1 className="seller-dashboard-page-title">Add New Listing</h1>
          <p className="add-listing-subtitle">
            List your pre-loved clothing for sale or rent
          </p>
        </header>

        <form className="add-listing-layout" onSubmit={handlePublish}>
          <div className="add-listing-main">
            <Card className="add-listing-section-card">
              <CardHeader className="add-listing-section-header">
                <CardTitle className="add-listing-section-title">
                  Clothing Images
                </CardTitle>
              </CardHeader>
              <CardContent className="add-listing-section-content">
                <label className="add-listing-upload-main" htmlFor="listing-images">
                  <CloudUpload size={40} strokeWidth={1.5} />
                  <p>Click to upload or drag and drop</p>
                  <span>SVG, PNG, JPG or WEBP (MAX. 800x400px)</span>
                  <input
                    id="listing-images"
                    type="file"
                    accept="image/svg+xml,image/png,image/jpeg,image/webp"
                    multiple
                    className="add-listing-upload-input"
                  />
                </label>
                <div className="add-listing-thumb-grid">
                  {previewThumbs.map((src, index) => (
                    <div key={src} className="add-listing-thumb">
                      <img src={src} alt={`Listing preview ${index + 1}`} />
                      <button
                        type="button"
                        className="add-listing-thumb-remove"
                        aria-label="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="add-listing-thumb add-listing-thumb--add">
                    <Plus size={22} />
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="add-listing-section-card">
              <CardHeader className="add-listing-section-header">
                <CardTitle className="add-listing-section-title">
                  Clothing Details
                </CardTitle>
              </CardHeader>
              <CardContent className="add-listing-section-content">
                <FieldGroup className="add-listing-details-grid">
                  <Field className="add-listing-field">
                    <FieldLabel htmlFor="listing-title">Listing Title</FieldLabel>
                    <Input
                      id="listing-title"
                      placeholder="e.g. Vintage Silk Midi Dress"
                      className="add-listing-input"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Field>
                  <Field className="add-listing-field">
                    <FieldLabel htmlFor="clothing-type">Clothing Type</FieldLabel>
                    <select
                      id="clothing-type"
                      className="add-listing-select"
                      value={clothingType}
                      onChange={(e) => setClothingType(e.target.value)}
                    >
                      {clothingTypes.map((type) => (
                        <option key={type} value={type} disabled={type === "Select Type"}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field className="add-listing-field add-listing-field--full">
                    <FieldLabel htmlFor="listing-description">Description</FieldLabel>
                    <textarea
                      id="listing-description"
                      rows={4}
                      placeholder="Tell buyers about the material, fit, and story of this piece..."
                      className="add-listing-textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Field>
                  <Field className="add-listing-field">
                    <FieldLabel>Size</FieldLabel>
                    <ChipGroup options={sizeOptions} value={size} onChange={setSize} />
                  </Field>
                  <Field className="add-listing-field">
                    <FieldLabel>Condition</FieldLabel>
                    <ChipGroup
                      options={conditionOptions}
                      value={condition}
                      onChange={setCondition}
                    />
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            <Card className="add-listing-section-card">
              <CardHeader className="add-listing-section-header">
                <CardTitle className="add-listing-section-title">
                  Listing Type &amp; Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="add-listing-section-content">
                <div className="add-listing-type-toggle">
                  <Button
                    type="button"
                    className={`add-listing-type-btn ${
                      listingType === "sale" ? "is-active" : ""
                    }`}
                    onClick={() => setListingType("sale")}
                  >
                    Sale
                  </Button>
                  <Button
                    type="button"
                    className={`add-listing-type-btn ${
                      listingType === "rent" ? "is-active" : ""
                    }`}
                    onClick={() => setListingType("rent")}
                  >
                    Rent
                  </Button>
                </div>

                {listingType === "sale" ? (
                  <FieldGroup className="add-listing-pricing-grid">
                    <Field className="add-listing-field">
                      <FieldLabel htmlFor="sale-price">Selling Price ($)</FieldLabel>
                      <Input
                        id="sale-price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="add-listing-input"
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
                      />
                    </Field>
                    <Field className="add-listing-field add-listing-field--toggle">
                      <FieldLabel htmlFor="enable-bidding">Enable Bidding</FieldLabel>
                      <button
                        id="enable-bidding"
                        type="button"
                        role="switch"
                        aria-checked={biddingEnabled}
                        className={`add-listing-switch ${
                          biddingEnabled ? "is-on" : ""
                        }`}
                        onClick={() => setBiddingEnabled((on) => !on)}
                      >
                        <span className="add-listing-switch-knob" />
                      </button>
                    </Field>
                    {biddingEnabled && (
                      <div className="add-listing-bidding-fields">
                        <Field className="add-listing-field">
                          <FieldLabel htmlFor="starting-bid">Starting Bid ($)</FieldLabel>
                          <Input
                            id="starting-bid"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="add-listing-input"
                            value={startingBid}
                            onChange={(e) => setStartingBid(e.target.value)}
                          />
                        </Field>
                        <Field className="add-listing-field">
                          <FieldLabel htmlFor="auction-end">Auction End Date</FieldLabel>
                          <Input
                            id="auction-end"
                            type="date"
                            className="add-listing-input"
                            value={auctionEndDate}
                            onChange={(e) => setAuctionEndDate(e.target.value)}
                          />
                        </Field>
                      </div>
                    )}
                  </FieldGroup>
                ) : (
                  <FieldGroup className="add-listing-pricing-grid">
                    <Field className="add-listing-field">
                      <FieldLabel htmlFor="rent-price">Daily Rental Price ($)</FieldLabel>
                      <Input
                        id="rent-price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="add-listing-input"
                        value={rentPrice}
                        onChange={(e) => setRentPrice(e.target.value)}
                      />
                    </Field>
                    <Field className="add-listing-field">
                      <FieldLabel htmlFor="security-deposit">
                        Security Deposit (Optional)
                      </FieldLabel>
                      <Input
                        id="security-deposit"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="add-listing-input"
                        value={securityDeposit}
                        onChange={(e) => setSecurityDeposit(e.target.value)}
                      />
                    </Field>
                  </FieldGroup>
                )}
              </CardContent>
            </Card>
          </div>

          <aside className="add-listing-sidebar">
            <p className="add-listing-preview-label">Live Preview</p>
            <Card className="add-listing-preview-card">
              <div className="add-listing-preview-image-wrap">
                <img src={previewHero} alt={previewTitle} />
                <span className="add-listing-preview-badge add-listing-preview-badge--condition">
                  {condition}
                </span>
                <span className="add-listing-preview-badge add-listing-preview-badge--type">
                  {listingType === "sale" ? "SALE" : "RENT"}
                </span>
              </div>
              <CardContent className="add-listing-preview-body">
                <div className="add-listing-preview-top">
                  <div>
                    <p className="add-listing-preview-brand">{clothingType}</p>
                    <h3 className="add-listing-preview-title">{previewTitle}</h3>
                  </div>
                  <p className="add-listing-preview-price">{previewPrice}</p>
                </div>
                <div className="add-listing-preview-seller">
                  <img src={sellerAvatar} alt="Zarish" />
                  <span>Zarish</span>
                </div>
              </CardContent>
            </Card>

            <div className="add-listing-actions">
              <Button type="submit" className="add-listing-publish-btn">
                Publish Listing
              </Button>
              <Button
                type="button"
                variant="outline"
                className="add-listing-draft-btn"
                onClick={goToListings}
              >
                Save Draft
              </Button>
            </div>

            <Card className="add-listing-tip-card">
              <CardContent className="add-listing-tip-content">
                <div className="add-listing-tip-heading">
                  <Lightbulb size={16} />
                  <span>Seller Tip</span>
                </div>
                <p>
                  Listings with at least 5 high-quality photos from different angles
                  tend to sell 40% faster. Focus on lighting and clear detail shots!
                </p>
              </CardContent>
            </Card>
          </aside>
        </form>
    </div>
  );
};

export default SellerAddListing;
