function matchPath(link, pattern) {
  if (!link) return false;
  const path = link.split("?")[0];
  return path === pattern || link.startsWith(`${pattern}?`) || link.startsWith(`${pattern}/`);
}

function matchSection(link, section) {
  if (!link) return false;
  return link.includes(`section=${section}`);
}

export function getNotificationActions(notification) {
  const link = notification?.link?.trim() ?? "";
  const title = notification?.title?.trim() ?? "";
  const category = notification?.category ?? "system";

  if (!link || link === "/notification") {
    return { primary: null, secondary: null, nextSteps: [] };
  }

  const actions = {
    primary: { label: "Continue", path: link },
    secondary: null,
    nextSteps: [],
  };

  switch (title) {
    case "New Rental Request":
      actions.primary = { label: "Review rental request", path: link };
      actions.nextSteps = [
        "Open your seller orders inbox and approve or decline the request.",
        "Confirm rental dates and deposit details with the buyer if needed.",
      ];
      break;

    case "Rental Request Cancelled":
      actions.primary = { label: "View seller orders", path: link };
      actions.nextSteps = ["The buyer cancelled before you responded. No action is required."];
      break;

    case "Booking Confirmed":
      actions.primary = { label: "View my booking", path: link };
      actions.nextSteps = [
        "Check pickup or delivery details in your orders.",
        "Message the seller if you need to confirm timing.",
      ];
      break;

    case "Request Declined":
      actions.primary = { label: "Browse other dresses", path: "/femaleFashion" };
      actions.secondary = { label: "View my orders", path: link };
      actions.nextSteps = [
        "This rental request was not accepted.",
        "Browse similar listings or try another seller.",
      ];
      break;

    case "Rental Completed":
      actions.primary = { label: "View order history", path: link };
      actions.nextSteps = ["Your rental is complete. Leave a review if you enjoyed the experience."];
      break;

    case "Listing Accepted":
      actions.primary = link.includes("/dress/")
        ? { label: "View live listing", path: link }
        : { label: "Manage my listings", path: link };
      actions.nextSteps = [
        "Your listing is now visible to buyers.",
        "Share it or monitor bids and rental requests from your seller dashboard.",
      ];
      break;

    case "Listing Rejected":
      actions.primary = { label: "Fix and resubmit listing", path: link };
      actions.nextSteps = [
        "Review the admin feedback in your listings panel.",
        "Update photos, pricing, or description before submitting again.",
      ];
      break;

    case "Seller Account Approved":
      actions.primary = { label: "Open seller dashboard", path: link };
      actions.nextSteps = [
        "Your seller account is active.",
        "Add your first listing to start selling or renting on Relux Hub.",
      ];
      break;

    case "Seller Application Rejected":
      actions.primary = { label: "View rejection details", path: link };
      actions.secondary = { label: "Apply again", path: "/sellerVerification" };
      actions.nextSteps = [
        "Read the admin note explaining why the application was not approved.",
        "Update your documents and submit a new application when ready.",
      ];
      break;

    case "More Information Needed":
      actions.primary = { label: "Update verification documents", path: link };
      actions.secondary = { label: "Upload new CNIC images", path: "/sellerVerification", state: { updateDocuments: true } };
      actions.nextSteps = [
        "The admin needs clearer or missing information before approving your seller account.",
        "Upload updated documents and wait for review within 24–48 hours.",
      ];
      break;

    case "New Bid Received":
      actions.primary = link.includes("/dress/")
        ? { label: "View auction listing", path: link }
        : { label: "Manage listings", path: link };
      actions.nextSteps = [
        "A buyer placed a bid on your resale listing.",
        "Monitor the auction and respond to messages if the buyer has questions.",
      ];
      break;

    case "You Have Been Outbid":
      actions.primary = link.includes("/dress/")
        ? { label: "Place a higher bid", path: link }
        : { label: "View my bids", path: link };
      actions.nextSteps = [
        "Another buyer currently has the highest bid.",
        "Open the listing to increase your bid before the auction ends.",
      ];
      break;

    case "New Message":
      actions.primary = { label: "Open conversation", path: link };
      actions.nextSteps = ["Reply from your messages inbox to keep the conversation going."];
      break;

    default:
      if (category === "orders" && matchSection(link, "orders")) {
        actions.primary = {
          label: link.includes("sellerProfile") ? "View seller orders" : "View my orders",
          path: link,
        };
      } else if (category === "listings") {
        actions.primary = {
          label: link.includes("/dress/") ? "View listing" : "Manage listings",
          path: link,
        };
      } else if (category === "bids") {
        actions.primary = {
          label: link.includes("/dress/") ? "View listing" : "View my bids",
          path: link,
        };
      } else if (matchPath(link, "/messages")) {
        actions.primary = { label: "Open messages", path: link };
      } else if (matchPath(link, "/sellerProfile")) {
        actions.primary = { label: "Go to seller dashboard", path: link };
      } else if (matchPath(link, "/profile")) {
        actions.primary = { label: "Go to my profile", path: link };
      } else if (matchPath(link, "/seller-pending")) {
        actions.primary = { label: "View application status", path: link };
      } else if (matchPath(link, "/seller-rejected")) {
        actions.primary = { label: "View rejection details", path: link };
      }
      break;
  }

  return actions;
}

export function shouldShowNotificationActions(notification) {
  const { primary } = getNotificationActions(notification);
  return Boolean(primary);
}
