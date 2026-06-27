const BUYER_AVATARS = {
  ayesha:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCg4KFJi-xjnYJbPlL3HbtXyyr5yhiE2Fydqsz_bIuZwvZZ_eugrV_sy_7379PovdV0Wxpqm8vbDy_YnbBcSppKq5WmJAOKWPlRfoiZ9311-QHE1Ef7gBJ9ckQ0B3aSo3nMCp_C0JfZj7VtXKFN6IJWYJlZVPsVQitXIy1BI55NYfH7hRSHwlcGQkcbm9qMvRqgandAUOidyQFy0zz_7J2miRGR9bTG5XfwhylJsYzSJs_NsXKwxUf7_Kj-zoqZs8pScqjOTe35z2oK",
  fatima:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDyGJnM5y4jfBXKtcNuJxlOcnx-svsckJx4IBXueyqKrdSWM2hdBbjYXW9ULTgFvuDDjMiIkdeKwFw1CGFXRdx2-POSdMys1dLYfFWv0TqiR_S80yjHVwQY0gjuY9rns4zDRGLBLJ9CM997am3u4ki1hxgMDDG0CgUrFpoSOai4bJiJDq5Uc7fz-gtM0UYOrnpJO51zYCTNFAxJILA4DSC2uGczqhHctdvgaZUzLK2HEXgI6moIjb9RBs4DUOg9nO3QkvfB3LsNLVUT",
  hina:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAV_Q58P3tOM_BdZ7FugrByF2hGdVkOd8ypdFq0Y6qIvVV6BLq0KVldQNMfN3odhTp9AZ-wksa4aF1F9PIYbiixuCt9YiQKjqQGV_keBYmXXn5IDem8QG7anjQ8D3yafRx3E2_ENGA52gsaVff0J29MmXG4kQxwxQyp_ZynHJBUyFfcznDVQIbanS-0DKHIMK_MEb6zB6p-zMAd6sj_efaIxsdXWnceCp7XJpKV2cAoJx4NAtBHM3MYMObKIbcvgVDB1ENKirXmYJbX",
};

const LISTING_IMAGES = {
  "silk-slip":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAV_Q58P3tOM_BdZ7FugrByF2hGdVkOd8ypdFq0Y6qIvVV6BLq0KVldQNMfN3odhTp9AZ-wksa4aF1F9PIYbiixuCt9YiQKjqQGV_keBYmXXn5IDem8QG7anjQ8D3yafRx3E2_ENGA52gsaVff0J29MmXG4kQxwxQyp_ZynHJBUyFfcznDVQIbanS-0DKHIMK_MEb6zB6p-zMAd6sj_efaIxsdXWnceCp7XJpKV2cAoJx4NAtBHM3MYMObKIbcvgVDB1ENKirXmYJbX",
  "walima-gown":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCpg8TzKIlJBFhyEUYqerMoEjBDiDqV0rpb4lQJuyr8wSrrXnBdPmGXiTxuy8RQ2INfNuIEI8mSmiHm3DxRCuiuzBjnobYo2KMjppce0_DqAsnNyqHqW0XvZGvlilOWRnLYpLARVEl90grSGeTTYVHki2aL08XFQ4kPtzXTRvOuzU-vola6Kct2i-lfkoD4Q1IXuzEXuHn2SSvK1AKkwnpyH6BGifQXc-CtofQyw4tiEQt5WxJBoPzwOOzrC2a6uHAflnWvvLWUQdGD",
  "cashmere-knit":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAQemD3e6BOZATewDckoKN6LGnMsltEY2gw2q8lUInmROjSEuYbIBlXLU9LUnCGJIGwNMXoNKyqeBcXytDaU5EI9HU4SsDZZzh8zPiKHd9ZgptgIA9vSmf2EVijv5Q65Z4SF_wE4V54whxi3f5U9mej7h0idCDMflF_MmbmFSiI6jigtowaWzcJQd8eQ8qHoXkLskRTeqv-DsFY0OYczzrRtmuKiRt8dqoNh-zIy4f85wyWtLtisvVC3LIzzo-_yP2PF2M4C_dnSjkz",
  "wool-blazer":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBQlU7p5bA5NVI6b4zFxcHYyPDo0PdZzBRaZ32I-fEPE1Kf346un0l1Ll18TKnXlFrcUqIFINZ_T9y8zBBXnPQFGv7xl8Woa64WcjOX8Itv8oSzHzRE9McEBEqmjtLYjk8ZVcO2C4Q1t5ZfIL1jGi5PKNy4WEG0RiSk1ydihmNy56AN43CpmfAJdSIJYyktUuG55aXi0bDQxaTNEM0PUQ7v2M2bmLmtAlR1AjB4pCFyHGMvFcmwYSI-egpGaB3iMbSryT7tIocxKVUU",
};

export const SELLER_INBOX_CONVERSATIONS = [
  {
    id: "silk-slip",
    listingId: "silk-slip",
    buyerName: "Ayesha Khan",
    preview: "Is this available for rent from July 12–15?",
    timeLabel: "12m ago",
    listingTitle: "Vintage Silk Slip Dress",
    listingImage: LISTING_IMAGES["silk-slip"],
    listingType: "Rent",
    online: true,
    unread: 2,
  },
  {
    id: "walima-gown",
    listingId: "walima-gown",
    buyerName: "Sarah J.",
    preview: "Can I place a bid before the auction ends tonight?",
    timeLabel: "45m ago",
    listingTitle: "Mint Pearl Walima Gown",
    listingImage: LISTING_IMAGES["walima-gown"],
    listingType: "Auction",
    online: false,
    unread: 1,
  },
  {
    id: "cashmere-knit",
    listingId: "cashmere-knit",
    buyerName: "Fatima Ali",
    preview: "Would you accept Rs. 17,000 for the knit?",
    timeLabel: "2h ago",
    listingTitle: "Cashmere Oversized Knit",
    listingImage: LISTING_IMAGES["cashmere-knit"],
    listingType: "Sale",
    online: true,
    unread: 0,
  },
  {
    id: "wool-blazer",
    listingId: "wool-blazer",
    buyerName: "Hina Malik",
    preview: "Thank you! The blazer arrived in perfect condition.",
    timeLabel: "Yesterday",
    listingTitle: "Tailored Wool Blazer",
    listingImage: LISTING_IMAGES["wool-blazer"],
    listingType: "Sale",
    online: false,
    unread: 0,
  },
];

const INBOX_THREADS = {
  "silk-slip": {
    dateLabel: "Tuesday, Jun 23",
    buyerName: "Ayesha Khan",
    buyerFirstName: "Ayesha",
    buyerAvatar: BUYER_AVATARS.ayesha,
    listingTitle: "Vintage Silk Slip Dress",
    listingId: "silk-slip",
    listingType: "Rent",
    online: true,
    messages: [
      {
        id: "ss1",
        type: "received",
        text: "Hi Zarish! I love the Vintage Silk Slip Dress. Is it available for rent from July 12–15?",
        time: "11:05 AM",
      },
      {
        id: "ss2",
        type: "sent",
        text: "Hello Ayesha! Yes, those dates are open. The rental rate is $45/day with a refundable deposit.",
        time: "11:10 AM",
        status: "Read",
      },
      {
        id: "ss3",
        type: "received",
        text: "Perfect. Can you confirm the bust measurement? I'm usually between size S and M.",
        time: "11:14 AM",
      },
    ],
  },
  "walima-gown": {
    dateLabel: "Tuesday, Jun 23",
    buyerName: "Sarah J.",
    buyerFirstName: "Sarah",
    buyerAvatar: BUYER_AVATARS.ayesha,
    listingTitle: "Mint Pearl Walima Gown",
    listingId: "walima-gown",
    listingType: "Auction",
    online: false,
    messages: [
      {
        id: "wg1",
        type: "received",
        text: "Hi! I'm interested in the Walima gown auction. Can I place a bid before it ends tonight?",
        time: "9:40 AM",
      },
      {
        id: "wg2",
        type: "sent",
        text: "Hi Sarah! Absolutely — bidding is open until 11:59 PM. Current highest bid is $310.",
        time: "9:48 AM",
        status: "Read",
      },
      {
        id: "wg3",
        type: "received",
        text: "Great, I'll place my bid now. Is local pickup also available?",
        time: "9:52 AM",
      },
    ],
  },
  "cashmere-knit": {
    dateLabel: "Monday, Jun 22",
    buyerName: "Fatima Ali",
    buyerFirstName: "Fatima",
    buyerAvatar: BUYER_AVATARS.fatima,
    listingTitle: "Cashmere Oversized Knit",
    listingId: "cashmere-knit",
    listingType: "Sale",
    online: true,
    messages: [
      {
        id: "ck1",
        type: "received",
        text: "Assalamualaikum Zarish. Would you accept Rs. 17,000 for the cashmere knit?",
        time: "4:20 PM",
      },
      {
        id: "ck2",
        type: "sent",
        text: "Walaikum assalam Fatima! I can do Rs. 18,000 — it's in excellent condition with minimal wear.",
        time: "4:35 PM",
        status: "Read",
      },
    ],
  },
  "wool-blazer": {
    dateLabel: "Sunday, Jun 21",
    buyerName: "Hina Malik",
    buyerFirstName: "Hina",
    buyerAvatar: BUYER_AVATARS.hina,
    listingTitle: "Tailored Wool Blazer",
    listingId: "wool-blazer",
    listingType: "Sale",
    online: false,
    messages: [
      {
        id: "wb1",
        type: "received",
        text: "Just received the blazer — thank you! It fits perfectly.",
        time: "6:10 PM",
      },
      {
        id: "wb2",
        type: "sent",
        text: "So glad to hear that, Hina! Enjoy wearing it and thank you for shopping on Relux Hub.",
        time: "6:18 PM",
        status: "Read",
      },
      {
        id: "wb3",
        type: "received",
        text: "Thank you! The blazer arrived in perfect condition.",
        time: "6:20 PM",
      },
    ],
  },
};

export const getSellerInboxConversations = (prioritizeId) => {
  const all = SELLER_INBOX_CONVERSATIONS;

  if (!prioritizeId) return all;

  const activeIndex = all.findIndex((item) => item.id === prioritizeId);
  if (activeIndex <= 0) return all;

  const reordered = [...all];
  const [active] = reordered.splice(activeIndex, 1);
  return [active, ...reordered];
};

export const getSellerInboxThread = (conversationId) =>
  INBOX_THREADS[conversationId] ?? null;

export const getSellerInboxConversation = (conversationId) =>
  SELLER_INBOX_CONVERSATIONS.find((item) => item.id === conversationId) ?? null;
