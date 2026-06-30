import { getDressById } from "./dressCatalog";

const SELLER_AVATAR =
  "https://lh3.googleusercontent.com/aida/ADBb0ujohRWgQ50MBV5Zu6B5JJrUBSMug_AfHZebnoczRhOhJzAXf79mVF55Khh2LMR66JxsHZ9-YbsC70LF4H2C7ncMCc6Ifarhb2-lAFWGpQb8FCUO1KbSkpz8za-tyTa1BOMtuSVGxl9NVf7QDnB45hGn0JkCcTZkZNYNgyMuNXHfSOVBlsUXGqsMarcVpEsI6UwL-bg9nBB2WiVA_O3ZXuNNHmYWFJ0qZ08L5NS9AUPdOEWi4--zFGo0d7FcWb2lMOR49pbTqoL4EA";

const OTHER_AVATARS = {
  zahra:
    "https://lh3.googleusercontent.com/aida/ADBb0uiTFgsbvfdt2tBCF8y8SG7-OvD6xFJqJlZ5hGCOmJSS5wnRnP9OmjDmkJKa5tzq8igD6vEF2HU3eZdh_Lh6-jqzhq_k_tZI5_UPAMv7mgjmqVut5z1ijRMaztXhMsUP6sn2EtG3d5gPrTf6S7kzwwvs4jb2SRqXhu2S9JieVTCPNf3DT49BQaGvMUhV-V9DKVQROyxBW8zHYQPEVjqP8Uj8VT0ECfAESginyWv2zh7X9vVGaKhExpy3zAaKGR3q8X0bm63tf-iFew",
  heritage:
    "https://lh3.googleusercontent.com/aida/ADBb0ujBoI4svC81Fpq118ySfrR93OD0DcpN2at2hwIEzb9AVTVZ6Ig9Go4dJWVmYuHqXaB8oQ-mBU4RJ5MSp1dvDyPxPMYuDkNF6k_toHlfl1PLU2ytoC7WLVmEQPYwmKFYw2TIf9SopNme9OMB6aB-v_QAnzyGpSYElujhmp2bV-ZquSdQYrau4NNSgi3SYmlF2RDrc92g31ARXrAyUQzZLwtrPDk5H9IFuWeSNJpwCkf0_C3l9mPseeo9iH6Ud-b0yjMZCzs0IUE0GbE",
};

const RESALE_DRESS_IDS = [
  "emerald-heritage-pishwas",
  "male-2",
  "male-4",
  "male-6",
  "female-2",
  "female-4",
  "female-6",
  "kids-2",
  "kids-4",
  "kids-6",
];

const TIME_LABELS = [
  "2m ago",
  "12m ago",
  "45m ago",
  "1h ago",
  "2h ago",
  "3h ago",
  "Yesterday",
  "2 days ago",
  "3 days ago",
  "Last week",
];

const DRESS_PREVIEWS = {
  "emerald-heritage-pishwas":
    "The embroidery on the cuffs is handmade zardozi. Would you like a close-up?",
  "male-2": "The wool blend is Italian — happy to share fabric tags if needed.",
  "male-4": "Sherwani was worn once for a wedding. Still has original packaging.",
  "male-6": "Prince coat fits true to size. I can share shoulder measurements.",
  "female-2": "Lace is pristine — no snags. Stored in a breathable garment bag.",
  "female-4": "Velvet kalidar has light wear on the hem only. Photos available.",
  "female-6": "Sequins are intact. Perfect for evening events.",
  "kids-2": "Brand new with tags still attached. Never worn.",
  "kids-4": "Mirror work is all secure. Worn once for Eid.",
  "kids-6": "Organza is crisp — professionally steamed before listing.",
};

const OTHER_CONVERSATIONS = [
  {
    id: "zahra-boutique",
    dressId: null,
    sellerName: "Zahra Boutique",
    preview: "Accepted your bid for the Crimson Anarkali. Shipping within 24 hours.",
    timeLabel: "1h ago",
    dressTitle: "Crimson Anarkali",
    dressImage:
      "https://lh3.googleusercontent.com/aida/ADBb0uiFJh-4krbzfm2r7ndHuGhvCoCWU4sh5muhVNh4dTiDAJNOsaMX330FJgowNJhpgEwgto2z63Eu67OqBo4tPwe6cZmebAYqoBC9E0gn4SNd_0BZlBce1WBK1OtlWRBzGfwLdXPLb97iX3UadKqY2mkm3WxREsTkvBSZetpxdUry0-X4hN8sFxq0df_bnhkd-lDPWu1DOoB_Ezdyzd3MVXk7EEwOWRgGelEZ_18oy1wT6Wo3Fy3YROcht65vQm03K3wxyUjru_fzRTQ",
    avatar: OTHER_AVATARS.zahra,
    online: false,
    unread: 1,
  },
  {
    id: "heritage-atelier",
    dressId: null,
    sellerName: "Heritage Atelier",
    preview: "Checking the measurements for the size M. I'll get back to you shortly.",
    timeLabel: "Yesterday",
    dressTitle: "Ivory Peshwas",
    dressImage:
      "https://lh3.googleusercontent.com/aida/ADBb0uhrKM44o_0kOp3FwuIxwiA_ob7cET-N3XWY5e4_37NsyzmHTRpksNtDNHtV8ZgIc3CDbul-kgkeR-qdJhmAD9kPF8io1k7YS71a--xHtlHi9oCWuauD2lajNUhoR_W9Ns83hDavW8w-WqY6jn52b5OrS9NhsaZFkpHHrWktsewjJRLOuluXSdcq6uAtRYOOK4fQdb3Elu_yknDzvbDO_KHHMvT71Q3EbxQDWxHArZ6KxVi0mjHQZ9AzR9gSNFndIcR5Q_qDG84FTxY",
    avatar: OTHER_AVATARS.heritage,
    online: false,
  },
];

const buildDressMessages = ({ sellerName, dressTitle, dressImage, currentBidFormatted }) => [
  {
    id: "m1",
    type: "received",
    text: `Hello! Thank you for inquiring about the ${dressTitle}. It's one of my personal favorites from my collection.`,
    time: "10:15 AM",
    avatar: SELLER_AVATAR,
  },
  {
    id: "m2",
    type: "sent",
    text: `Hi ${sellerName.split(" ")[0]}! It looks stunning. I'm very interested. Could you tell me more about the sizing and condition?`,
    time: "10:17 AM",
    status: "Read",
  },
  {
    id: "m3",
    type: "received",
    text: "Happy to help! The piece has been professionally dry-cleaned and stored in a garment bag. Here is a closer look at the craftsmanship.",
    time: "10:20 AM",
    avatar: SELLER_AVATAR,
    image: dressImage,
  },
  {
    id: "m4",
    type: "sent",
    text: `The detail is breathtaking. Would you be open to an offer around ${currentBidFormatted}? I can complete checkout today if we agree.`,
    time: "10:22 AM",
    status: "Sent",
  },
];

const STATIC_THREADS = {
  "zahra-boutique": {
    dateLabel: "Monday, Jun 22",
    sellerName: "Zahra Boutique",
    sellerFirstName: "Zahra",
    sellerAvatar: OTHER_AVATARS.zahra,
    dressTitle: "Crimson Anarkali",
    dressId: null,
    online: false,
    messages: [
      {
        id: "z1",
        type: "received",
        text: "Congratulations! Your winning bid for the Crimson Anarkali has been accepted.",
        time: "9:30 AM",
        avatar: OTHER_AVATARS.zahra,
      },
      {
        id: "z2",
        type: "sent",
        text: "That's wonderful news! When can I expect shipping?",
        time: "9:35 AM",
        status: "Read",
      },
      {
        id: "z3",
        type: "received",
        text: "We'll dispatch within 24 hours via our insured courier.",
        time: "9:40 AM",
        avatar: OTHER_AVATARS.zahra,
      },
    ],
  },
  "heritage-atelier": {
    dateLabel: "Sunday, Jun 21",
    sellerName: "Heritage Atelier",
    sellerFirstName: "Heritage",
    sellerAvatar: OTHER_AVATARS.heritage,
    dressTitle: "Ivory Peshwas",
    dressId: null,
    online: false,
    messages: [
      {
        id: "h1",
        type: "received",
        text: "Thank you for your interest in the Ivory Peshwas. What size are you looking for?",
        time: "4:10 PM",
        avatar: OTHER_AVATARS.heritage,
      },
      {
        id: "h2",
        type: "sent",
        text: "I'm usually a medium. Could you confirm the bust and length measurements?",
        time: "4:15 PM",
        status: "Read",
      },
      {
        id: "h3",
        type: "received",
        text: "Checking the measurements for size M. I'll get back to you shortly with exact numbers.",
        time: "4:20 PM",
        avatar: OTHER_AVATARS.heritage,
      },
    ],
  },
};

const buildDressConversation = (dressId, index) => {
  const dress = getDressById(dressId);
  const dressImage = dress.mainImage ?? dress.image ?? dress.gallery?.[0];

  return {
    id: dressId,
    dressId,
    sellerName: dress.seller ?? "Amina Sheikh",
    preview: DRESS_PREVIEWS[dressId] ?? `Inquiry about ${dress.title}`,
    timeLabel: TIME_LABELS[index % TIME_LABELS.length],
    dressTitle: dress.title,
    dressImage,
    avatar: SELLER_AVATAR,
    online: index < 4,
    unread: index === 0 ? 2 : index === 2 ? 1 : 0,
  };
};

export const getAllConversations = (prioritizeId) => {
  const dressConversations = RESALE_DRESS_IDS.map((id, index) =>
    buildDressConversation(id, index),
  );
  const all = [...dressConversations, ...OTHER_CONVERSATIONS];

  if (!prioritizeId) return all;

  const activeIndex = all.findIndex((c) => c.id === prioritizeId);
  if (activeIndex <= 0) return all;

  const reordered = [...all];
  const [active] = reordered.splice(activeIndex, 1);
  return [active, ...reordered];
};

export const getChatThread = (conversationId) => {
  if (STATIC_THREADS[conversationId]) {
    return STATIC_THREADS[conversationId];
  }

  const dress = getDressById(conversationId);
  const sellerName = dress.seller ?? "Amina Sheikh";
  const dressTitle = dress.title;
  const dressImage = dress.mainImage ?? dress.image ?? dress.gallery?.[0];
  const currentBidFormatted = dress.currentBidFormatted ?? dress.priceFormatted ?? "Rs. 0";

  return {
    dateLabel: "Tuesday, Jun 23",
    sellerName,
    sellerFirstName: sellerName.split(" ")[0],
    sellerAvatar: SELLER_AVATAR,
    dressTitle,
    dressId: conversationId,
    online: true,
    messages: buildDressMessages({ sellerName, dressTitle, dressImage, currentBidFormatted }),
  };
};

export const getConversationById = (conversationId) => {
  const conversations = getAllConversations();
  return conversations.find((c) => c.id === conversationId) ?? conversations[0];
};
