import { useAuth } from "@/context/AuthContext";
import Profile from "@/component/profile";
import ProfileWishlist from "@/component/profileWishlist";

export default function WishlistRoute() {
  const { user } = useAuth();

  if (user?.role === "buyer") {
    return <Profile section="wishlist" />;
  }

  return (
    <section className="profile-wishlist-page" style={{ padding: "1.5rem" }}>
      <ProfileWishlist />
    </section>
  );
}
