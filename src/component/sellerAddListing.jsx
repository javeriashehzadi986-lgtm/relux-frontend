import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CloudUpload, Plus, X, Lightbulb, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isMongoListingId } from "@/data/dressCatalog";
import {
  LISTING_CONDITION_OPTIONS,
  LISTING_SIZE_OPTIONS,
  normalizeListingCondition,
  normalizeListingSize,
} from "@/data/listingSpecs";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { prepareImageList } from "@/utils/imageUpload";
import "./sellerAddListing.css";
import { usePublicMainCategories, usePublicStyleFilters } from "@/hooks/usePublicStyleFilters";

const clothingTypes = [
  "Select Type",
  "Dress",
  "Shirt",
  "Knitwear",
  "Outerwear",
];

const sizeOptions = LISTING_SIZE_OPTIONS;
const conditionOptions = LISTING_CONDITION_OPTIONS;

const DEFAULT_AUCTION_END_TIME = "23:59";

function splitAuctionEnd(value) {
  if (!value) {
    return { date: "", time: DEFAULT_AUCTION_END_TIME };
  }

  const raw = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return { date: raw, time: DEFAULT_AUCTION_END_TIME };
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return { date: "", time: DEFAULT_AUCTION_END_TIME };
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  };
}

function combineAuctionEnd(date, time) {
  if (!date) return "";
  const clock = time || DEFAULT_AUCTION_END_TIME;
  const local = new Date(`${date}T${clock}:00`);
  if (Number.isNaN(local.getTime())) return date;
  return local.toISOString();
}

function getSellerInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "S";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

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

function SelectField({ id, label, value, onChange, children, optional }) {
  return (
    <Field className="add-listing-field add-listing-details-field">
      <FieldLabel htmlFor={id}>
        {label}
        {optional ? (
          <span className="add-listing-optional"> (Optional)</span>
        ) : null}
      </FieldLabel>
      <div className="add-listing-details-select-wrap">
        <select
          id={id}
          className="add-listing-details-select"
          value={value}
          onChange={onChange}
        >
          {children}
        </select>
        <ChevronDown size={18} className="add-listing-details-select-icon" aria-hidden="true" />
      </div>
    </Field>
  );
}

const SellerAddListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const editListingId = location.state?.editListingId;
  const [listingType, setListingType] = useState("sale");
  const [size, setSize] = useState("S");
  const [condition, setCondition] = useState("Like New");
  const [title, setTitle] = useState("");
  const [clothingType, setClothingType] = useState("Dress");
  const [mainCategory, setMainCategory] = useState("Female");
  const [style, setStyle] = useState("Casual");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [minBid, setMinBid] = useState("");
  const [auctionEndDate, setAuctionEndDate] = useState("");
  const [auctionEndTime, setAuctionEndTime] = useState(DEFAULT_AUCTION_END_TIME);
  const [rentPrice, setRentPrice] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [previewHeroImage, setPreviewHeroImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [imageError, setImageError] = useState("");
  const listingImagesRef = useRef(null);
  const addThumbRef = useRef(null);
  const imagesSectionRef = useRef(null);
  const listingFileMapRef = useRef(new Map());

  const MIN_LISTING_IMAGES = 4;

  const { mains: mainOptions } = usePublicMainCategories();
  const selectedMain = mainOptions.find((item) => item.name === mainCategory);
  const styleOptions = usePublicStyleFilters(selectedMain?.slug || "");

  useEffect(() => {
    if (!mainOptions.length) return;
    if (mainOptions.some((item) => item.name === mainCategory)) return;
    setMainCategory(mainOptions[0].name);
  }, [mainOptions, mainCategory]);

  useEffect(() => {
    if (!editListingId) return undefined;

    if (!isMongoListingId(editListingId)) {
      return undefined;
    }

    let cancelled = false;

    api
      .getMyListing(editListingId)
      .then(({ listing }) => {
        if (cancelled || !listing) return;

        setTitle(listing.title || "");
        setBrand(listing.brand || "");
        setDescription(listing.description || "");
        setListingType(listing.listingType === "rent" ? "rent" : "sale");
        setMainCategory(listing.mainCategory || "Female");
        setStyle(listing.style || "Casual");
        setClothingType(listing.clothingType || "Dress");

        if (listing.listingType === "rent") {
          setRentPrice(listing.rentPrice || "");
          setItemPrice(listing.itemPrice || "");
        } else {
          setSalePrice(listing.salePrice || "");
          setStartingBid(listing.startingBid || "");
          setMinBid(listing.minBid || "");
          const auctionEnd = splitAuctionEnd(listing.auctionEndDate || "");
          setAuctionEndDate(auctionEnd.date);
          setAuctionEndTime(auctionEnd.time);
        }

        if (listing.listingSize) {
          setSize(normalizeListingSize(listing.listingSize));
        }
        if (listing.listingCondition) {
          setCondition(normalizeListingCondition(listing.listingCondition));
        }

        const gallery = listing.gallery?.length
          ? listing.gallery
          : listing.mainImage
            ? [listing.mainImage]
            : [];
        if (gallery.length) {
          setPreviewHeroImage(gallery[0]);
          setPreviewImages(gallery);
        }
      })
      .catch(() => {
        // keep empty form if listing cannot be loaded
      });

    return () => {
      cancelled = true;
    };
  }, [editListingId]);

  useEffect(() => {
    if (!styleOptions.length) return;
    const keys = styleOptions.map((item) => item.key);
    if (keys.includes(style)) return;
    if (style === "Bridal" && keys.includes("Groom")) {
      setStyle("Groom");
    } else if (style === "Groom" && keys.includes("Bridal")) {
      setStyle("Bridal");
    } else {
      setStyle(keys[0]);
    }
  }, [mainCategory, styleOptions, style]);

  const securityDeposit = itemPrice;

  const previewTitle = title.trim() || "Listing title";
  const sellerDisplayName = user?.name?.trim() || "Seller";
  const sellerInitials = getSellerInitials(sellerDisplayName);
  const previewPrice =
    listingType === "sale"
      ? salePrice
        ? `Rs. ${Number(salePrice).toLocaleString("en-PK")}`
        : "Set sale price"
      : rentPrice
        ? `Rs. ${Number(rentPrice).toLocaleString("en-PK")} / day`
        : "Set rent price";

  const handleListingImagesChange = (event) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const entries = files.map((file) => {
      const url = URL.createObjectURL(file);
      listingFileMapRef.current.set(url, file);
      return url;
    });
    setPreviewImages((current) => [...current, ...entries]);
    setPreviewHeroImage((current) => current || entries[0]);
    setImageError("");
    setSubmitError("");
    event.target.value = "";
  };

  const handleRemoveThumb = (index) => {
    setPreviewImages((current) => {
      const removed = current[index];
      if (removed?.startsWith("blob:")) {
        listingFileMapRef.current.delete(removed);
        URL.revokeObjectURL(removed);
      }
      const next = current.filter((_, thumbIndex) => thumbIndex !== index);
      setPreviewHeroImage(next[0] ?? "");
      return next;
    });
  };

  const goToListings = () =>
    navigate("/sellerProfile?section=listings");

  const showFormError = (message, { focusImages = false } = {}) => {
    setSubmitError(message);
    if (focusImages) {
      setImageError(message);
      imagesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handlePublish = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setImageError("");

    if (previewImages.length < MIN_LISTING_IMAGES) {
      showFormError(
        `Please add at least ${MIN_LISTING_IMAGES} pictures from different angles before submitting.`,
        { focusImages: true },
      );
      return;
    }

    if (!title.trim()) {
      showFormError("Listing title is required.");
      return;
    }

    if (listingType === "sale") {
      if (!String(salePrice).trim()) {
        showFormError("Sale price is required.");
        return;
      }
      if (!(Number(salePrice) > 0)) {
        showFormError("Sale price must be greater than 0.");
        return;
      }
      if (!String(startingBid).trim()) {
        showFormError("Starting bid is required.");
        return;
      }
      if (!(Number(startingBid) > 0)) {
        showFormError("Starting bid must be greater than 0.");
        return;
      }
      if (!String(minBid).trim()) {
        showFormError("Minimum bid increment is required.");
        return;
      }
      if (!(Number(minBid) > 0)) {
        showFormError("Minimum bid increment must be greater than 0.");
        return;
      }
      if (!auctionEndDate || !auctionEndTime) {
        showFormError("Auction end date and time are required.");
        return;
      }
      const resolvedAuctionEndDate = combineAuctionEnd(auctionEndDate, auctionEndTime);
      const endAt = new Date(resolvedAuctionEndDate);
      if (Number.isNaN(endAt.getTime()) || endAt.getTime() <= Date.now()) {
        showFormError("Auction end must be a future date and time.");
        return;
      }
    } else {
      if (!String(rentPrice).trim()) {
        showFormError("Daily rental price is required.");
        return;
      }
      if (!(Number(rentPrice) > 0)) {
        showFormError("Daily rental price must be greater than 0.");
        return;
      }
      if (!String(itemPrice).trim()) {
        showFormError("Item price / security deposit is required.");
        return;
      }
      if (!(Number(itemPrice) > 0)) {
        showFormError("Item price / security deposit must be greater than 0.");
        return;
      }
    }

    setSubmitting(true);

    try {
      const preparedGallery = await prepareImageList(
        previewImages,
        listingFileMapRef.current,
      );
      const mainImage = preparedGallery[0] || "";
      if (!mainImage || preparedGallery.length < MIN_LISTING_IMAGES) {
        throw new Error(
          `Please add at least ${MIN_LISTING_IMAGES} pictures from different angles before submitting.`,
        );
      }

      const resolvedAuctionEndDate =
        listingType === "sale"
          ? combineAuctionEnd(auctionEndDate, auctionEndTime)
          : auctionEndDate;

      const payload = {
        title: title.trim(),
        brand: brand.trim(),
        description: description.trim(),
        listingType,
        listingSize: size,
        listingCondition: condition,
        mainCategory,
        style,
        clothingType,
        salePrice,
        startingBid,
        minBid,
        auctionEndDate: resolvedAuctionEndDate,
        rentPrice,
        itemPrice,
        mainImage,
        gallery: preparedGallery,
      };

      const isApiListing = editListingId && /^[a-f0-9]{24}$/i.test(editListingId);

      if (isApiListing) {
        await api.updateListing(editListingId, payload);
      } else {
        await api.createListing(payload);
      }

      goToListings();
    } catch (error) {
      const message = error.message || "Failed to submit listing";
      setSubmitError(message);
      if (/photo|image/i.test(message)) {
        setImageError(message);
        imagesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-listing-page">
        <header className="add-listing-header">
          <Button
            type="button"
            variant="ghost"
            className="add-listing-back-btn"
            asChild
          >
            <Link to="/sellerProfile?section=listings">Back to My Listings</Link>
          </Button>
          <h1 className="add-listing-title">
            {editListingId ? "Edit Listing" : "Add New Listing"}
          </h1>
          <p className="add-listing-subtitle">
            List your pre-loved clothing — submissions are reviewed by admin before going live
          </p>
        </header>

        <form className="add-listing-layout" onSubmit={handlePublish} noValidate>
          <div className="add-listing-main">
            <div ref={imagesSectionRef}>
              <Card className={`add-listing-section-card${imageError ? " has-image-error" : ""}`}>
                <CardHeader className="add-listing-section-header">
                  <CardTitle className="add-listing-section-title">
                    Clothing Images <span className="add-listing-required-mark">*</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="add-listing-section-content">
                  <label
                    className={`add-listing-upload-main${imageError ? " is-invalid" : ""}`}
                    htmlFor="listing-images"
                  >
                    <CloudUpload size={40} strokeWidth={1.5} />
                    <p>Click to upload or drag and drop</p>
                    <span>PNG, JPG or WEBP — at least 4 photos from different angles</span>
                    <input
                      id="listing-images"
                      ref={listingImagesRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      className="add-listing-upload-input"
                      onChange={handleListingImagesChange}
                    />
                  </label>
                  {imageError ? (
                    <p className="add-listing-image-error" role="alert">
                      {imageError}
                    </p>
                  ) : null}
                  <div className="add-listing-thumb-grid">
                    {previewImages.map((src, index) => (
                      <div key={`${src}-${index}`} className="add-listing-thumb">
                        <img src={src} alt={`Listing preview ${index + 1}`} />
                        <button
                          type="button"
                          className="add-listing-thumb-remove"
                          aria-label="Remove image"
                          onClick={() => handleRemoveThumb(index)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="add-listing-thumb add-listing-thumb--add"
                      onClick={() => addThumbRef.current?.click()}
                    >
                      <Plus size={22} />
                    </button>
                    <input
                      ref={addThumbRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      className="add-listing-upload-input"
                      hidden
                      onChange={handleListingImagesChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="add-listing-section-card add-listing-details-card">
              <CardHeader className="add-listing-section-header add-listing-details-header">
                <div>
                  <CardTitle className="add-listing-section-title">
                    Clothing Details
                  </CardTitle>
                  <CardDescription className="add-listing-details-subtitle">
                    Add accurate details so buyers can find and trust your listing.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="add-listing-section-content add-listing-details-content">
                <section className="add-listing-details-block">
                  <h3 className="add-listing-details-block-title">Basic Information</h3>
                  <FieldGroup className="add-listing-details-grid add-listing-details-grid--basic">
                    <Field className="add-listing-field add-listing-details-field add-listing-field--full">
                      <FieldLabel htmlFor="listing-title">Listing Title</FieldLabel>
                      <Input
                        id="listing-title"
                        placeholder="e.g. Vintage Silk Midi Dress"
                        className="add-listing-details-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </Field>
                    <Field className="add-listing-field add-listing-details-field add-listing-field--full">
                      <FieldLabel htmlFor="listing-description">Description</FieldLabel>
                      <textarea
                        id="listing-description"
                        rows={4}
                        placeholder="Tell buyers about the material, fit, and story of this piece..."
                        className="add-listing-details-textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Field>
                  </FieldGroup>
                </section>

                <section className="add-listing-details-block">
                  <h3 className="add-listing-details-block-title">Item Specifications</h3>
                  <FieldGroup className="add-listing-details-grid">
                    <SelectField
                      id="main-category"
                      label="Main Category"
                      value={mainCategory}
                      onChange={(e) => setMainCategory(e.target.value)}
                    >
                      {mainOptions.map((category) => (
                        <option key={category.slug} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </SelectField>
                    <SelectField
                      id="listing-style"
                      label="Style"
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                    >
                      {styleOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                    </SelectField>
                    <SelectField
                      id="clothing-type"
                      label="Clothing Type"
                      value={clothingType}
                      onChange={(e) => setClothingType(e.target.value)}
                    >
                      {clothingTypes.map((type) => (
                        <option key={type} value={type} disabled={type === "Select Type"}>
                          {type}
                        </option>
                      ))}
                    </SelectField>
                    <Field className="add-listing-field add-listing-details-field">
                      <FieldLabel htmlFor="listing-brand">
                        Brand <span className="add-listing-optional">(Optional)</span>
                      </FieldLabel>
                      <Input
                        id="listing-brand"
                        placeholder="Search brands..."
                        className="add-listing-details-input"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                      />
                    </Field>
                  </FieldGroup>
                </section>

                <section className="add-listing-details-block add-listing-details-block--last">
                  <h3 className="add-listing-details-block-title">Fit &amp; Condition</h3>
                  <FieldGroup className="add-listing-details-grid add-listing-details-grid--chips">
                    <Field className="add-listing-field add-listing-details-field">
                      <FieldLabel>Size</FieldLabel>
                      <div className="add-listing-details-chip-panel">
                        <ChipGroup options={sizeOptions} value={size} onChange={setSize} />
                      </div>
                    </Field>
                    <Field className="add-listing-field add-listing-details-field">
                      <FieldLabel>Condition</FieldLabel>
                      <div className="add-listing-details-chip-panel">
                        <ChipGroup
                          options={conditionOptions}
                          value={condition}
                          onChange={setCondition}
                        />
                      </div>
                    </Field>
                  </FieldGroup>
                </section>
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
                      <FieldLabel htmlFor="sale-price">Selling Price (Rs.)</FieldLabel>
                      <Input
                        id="sale-price"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        className="add-listing-input"
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
                        required
                      />
                    </Field>
                    <div className="add-listing-bidding-fields">
                      <p className="add-listing-bidding-note">
                        Sale listings require bidding. Set your auction details below.
                      </p>
                      <Field className="add-listing-field">
                        <FieldLabel htmlFor="starting-bid">Starting Bid (Rs.)</FieldLabel>
                        <Input
                          id="starting-bid"
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="0.00"
                          className="add-listing-input"
                          value={startingBid}
                          onChange={(e) => setStartingBid(e.target.value)}
                          required
                        />
                      </Field>
                      <Field className="add-listing-field">
                        <FieldLabel htmlFor="min-bid">Minimum Bid Increment (Rs.)</FieldLabel>
                        <Input
                          id="min-bid"
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="0.00"
                          className="add-listing-input"
                          value={minBid}
                          onChange={(e) => setMinBid(e.target.value)}
                          required
                        />
                      </Field>
                      <div className="add-listing-auction-end-row">
                        <Field className="add-listing-field">
                          <FieldLabel htmlFor="auction-end-date">Auction End Date</FieldLabel>
                          <Input
                            id="auction-end-date"
                            type="date"
                            className="add-listing-input"
                            value={auctionEndDate}
                            onChange={(e) => setAuctionEndDate(e.target.value)}
                            required
                          />
                        </Field>
                        <Field className="add-listing-field">
                          <FieldLabel htmlFor="auction-end-time">Auction End Time</FieldLabel>
                          <Input
                            id="auction-end-time"
                            type="time"
                            className="add-listing-input"
                            value={auctionEndTime}
                            onChange={(e) => setAuctionEndTime(e.target.value)}
                            required
                          />
                        </Field>
                      </div>
                      <p className="add-listing-field-hint">
                        Bidding closes on this date at the selected time (your local time).
                      </p>
                    </div>
                  </FieldGroup>
                ) : (
                  <FieldGroup className="add-listing-pricing-grid">
                    <Field className="add-listing-field">
                      <FieldLabel htmlFor="rent-price">Daily Rental Price ($)</FieldLabel>
                      <Input
                        id="rent-price"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        className="add-listing-input"
                        value={rentPrice}
                        onChange={(e) => setRentPrice(e.target.value)}
                        required
                      />
                    </Field>
                    <div className="add-listing-bidding-fields add-listing-rent-deposit-fields">
                      <p className="add-listing-bidding-note">
                        Security deposit is required and must equal the full item price.
                      </p>
                      <Field className="add-listing-field">
                        <FieldLabel htmlFor="item-price">Item Price ($)</FieldLabel>
                        <Input
                          id="item-price"
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="0.00"
                          className="add-listing-input"
                          value={itemPrice}
                          onChange={(e) => setItemPrice(e.target.value)}
                          required
                        />
                        <p className="add-listing-field-hint">
                          Enter the full value of the garment for insurance and deposit.
                        </p>
                      </Field>
                      <Field className="add-listing-field">
                        <FieldLabel htmlFor="security-deposit">Security Deposit ($)</FieldLabel>
                        <Input
                          id="security-deposit"
                          type="number"
                          className="add-listing-input add-listing-input--readonly"
                          value={securityDeposit}
                          readOnly
                          tabIndex={-1}
                          aria-readonly="true"
                        />
                        <p className="add-listing-field-hint">
                          Automatically set to match the item price.
                        </p>
                      </Field>
                    </div>
                  </FieldGroup>
                )}
              </CardContent>
            </Card>
          </div>

          <aside className="add-listing-sidebar">
            <p className="add-listing-preview-label">Live Preview</p>
            <Card className="add-listing-preview-card">
              <div className="add-listing-preview-image-wrap">
                {previewHeroImage ? (
                  <img src={previewHeroImage} alt={previewTitle} />
                ) : (
                  <div className="add-listing-preview-image-empty">Upload images to preview</div>
                )}
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
                    <p className="add-listing-preview-brand">
                      {[brand.trim(), mainCategory, style, clothingType]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <h3 className="add-listing-preview-title">{previewTitle}</h3>
                  </div>
                  <p className="add-listing-preview-price">{previewPrice}</p>
                </div>
                <div className="add-listing-preview-seller">
                  <span className="add-listing-preview-seller-avatar" aria-hidden="true">
                    {sellerInitials}
                  </span>
                  <span>{sellerDisplayName}</span>
                </div>
              </CardContent>
            </Card>

            <div className="add-listing-actions">
              {submitError ? (
                <p className="add-listing-submit-error" role="alert">
                  {submitError}
                </p>
              ) : null}
              <Button
                type="submit"
                className="add-listing-publish-btn"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit for Review"}
              </Button>
            </div>

            <Card className="add-listing-tip-card">
              <CardContent className="add-listing-tip-content">
                <div className="add-listing-tip-heading">
                  <Lightbulb size={16} />
                  <span>Seller Tip</span>
                </div>
                <p>
                  Add at least 4 high-quality photos from different angles. Clear
                  lighting and detail shots help your listing sell faster.
                </p>
              </CardContent>
            </Card>
          </aside>
        </form>
    </div>
  );
};

export default SellerAddListing;
