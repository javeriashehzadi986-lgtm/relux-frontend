const parsePrice = (price) => Number(String(price).replace(/[^\d]/g, "")) || 0;

export const WISHLIST_ITEMS = [
  {
    id: "female-1",
    brand: "Elan Luxury",
    title: "Royal Emerald Bridal Lehenga",
    listingType: "rent",
    price: "₨ 8,000",
    badge: "Pristine",
    badgeVariant: "primary",
    addedAt: 1,
    popularity: 5,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVh_ymJd-uGzRCLTDxmtnYgowXIFZWtD28_5edk15Gpg4mQoddsgPTHf1fk-2u_oFQqQ1gtj6xhbmpVSrzC15BhQvKsq2R_ChKwevbAcUNJCacjJU7E5xmD-C7v1NtcAl_lMXTCAD90dTQPcyujG6o3_m1PzYNME80G-fqj8c3D8p36AlEsVOrjOCC2h89kbWv2mRoid7mF-nJhsBYd8cfuPHT_Xkux1UE1DuFtMJDS_-OpnABEIPG9hYNpBhqfR3s4zHZlrK1cUlB",
  },
  {
    id: "female-2",
    brand: "Zaha Couture",
    title: "Ethereal Lace Abaya",
    listingType: "resale",
    price: "₨ 42,000",
    badge: "Like New",
    badgeVariant: "secondary",
    addedAt: 2,
    popularity: 4,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD9l5_S5Kw0tPO7ImG2ZCifAkI0JT8r4EKvjL-K7_quuPiR7HLBim3qJpa59SC8Agt_xkwZ6MgmPm2CBqqEgNY4Vij6YK01lGM8s5QuBsR607KgqyTRTeOzZkjGR8219b6etQp_PY3vwv_LPXWOM3Pi_RcUQTByHjkloMkMKxtSgoNFWAbwqPwm961bsAkT61WJ4DL8jY6hBCMo4USGAe8gXnv0Rt-oaW9NHtuH8B7BSKvYAJYilEShAp9g2hiyDNzhUfUyf9QZMmFF",
  },
  {
    id: "female-3",
    brand: "Faraz Manan",
    title: "Blossom Organza Gown",
    listingType: "rent",
    price: "₨ 7,000",
    badge: "Pristine",
    badgeVariant: "primary",
    addedAt: 3,
    popularity: 5,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSA-FJBW7OromnSWzZSaHuJAV_MxdaCIyzJjOHs7AgM4b_wO0uMO8sbTQPIHShD0bLtq47KqVXpUvrhEnxdaT5WAy3oql7kxmp--lvNe8-iOqVk9jiltunEjG51lwYO7nH6v-8acmcHh9udaov2s1KkOlHZdCdFf_WxvUt7cQV0HuCXd27mhz0aXeoKFeHNwUMxywEgZa1B_HdP4hFIxf5jL5hIFythWSOarf44Iwswbd66Blj5h0LDYjJ7Xr6FZ7yMucslpNcpam2",
  },
  {
    id: "male-2",
    brand: "Republic by Omar Farooq",
    title: "Charcoal Italian Wool Suit",
    listingType: "resale",
    price: "Rs. 42,000",
    badge: "Excellent",
    badgeVariant: "excellent",
    addedAt: 4,
    popularity: 3,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB82Zbg2Ch_SZ5m2n60FQX76_RhFiEEfyOXKH1S-1I2wCQus6u5Ix7KK_zD8XIfTpNPG0MsLWZ5KXKj9aiLdTE-qW-4owhklrrp9fgQVoC7YEHZLmn1N0d_7Ht8XTU5z7Xl9w3JpHiVgrG-2kz62QsERr8ccY54WAmqzgoJgDNFLUVgv1P30IWPT_zKulyCOTrTouU7M7Nt5usiLbFmEEkNLiw_UTsGCsAYoTp1nzQECpi4pjqTRdyH8_zA3nFXP_ON572uc_rBSd_N",
  },
  {
    id: "kids-1",
    brand: "J. Kids Collection",
    title: "Emerald Velvet Lehenga",
    listingType: "rent",
    price: "Rs. 5,000",
    badge: "Like New",
    badgeVariant: "primary",
    addedAt: 5,
    popularity: 4,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPAWrywHthD2bIuMRXjlirsHrAedKSqWI-mzFaO807fPcAcaY7KgVeI6CRbp8kjMxunVoWIu4hESh79OzHJwhvKllhtXd2ekZsfrnUKnUfwfdUYL-o8vM8VGHUm31aPIu0DF7guEAxU645MVyvbTCX1ReVpws7FRo-ztloti1iq9jmifrTUNu7RldvMf5DyBJKbT7MZ7th-Aw8ren-UiyEaf0whTZ6LqKcCKJm6W_2husgdLt9i28idwuttpPMAYjxbVm67_xgYuWI",
  },
  {
    id: "kids-3",
    brand: "Agha Noor Kids",
    title: "Powder Pink Gharara",
    listingType: "rent",
    price: "Rs. 5,000",
    badge: "Gently Used",
    badgeVariant: "primary",
    addedAt: 6,
    popularity: 2,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTaodaeaveS1nq7pWfSfEZ9AOVpHOwFZ990Kgtsfu7Z-NqiwCJjW8z9uzoqS5EI4eFhPK9aqPMBx1QyM2Y6XwJvad7zH55RJuRD1-t7eipFiFJywpf6JJ_VVznR__rnK3YZ0kGVrOXCUpL24fNj5WUzu31DS6op79GhmR8-mfLoruak2JH8XpnesDutq8NQzzLS92By02t1Od3DRbmZqZjUYq1jT9TethW8uswCxLYdSLb_ZUtOJgSxYlEw6yVsleyn5YH5sX0OmI_",
  },
].map((item) => ({
  ...item,
  sortPrice: parsePrice(item.price),
}));
