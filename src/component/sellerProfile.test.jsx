import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SellerProfile from "./sellerProfile";

const mockUpdateProfile = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ state: null }),
    useSearchParams: () => [new URLSearchParams("section=profile")],
  };
});

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: "seller-1",
      name: "Zara Seller",
      email: "zara@example.com",
      role: "seller",
      status: "active",
      phone: "03001234567",
      city: "Islamabad",
      address: "Personal address line",
      returnContactName: "Zara Returns Desk",
      returnPhone: "03009998877",
      returnCity: "Rawalpindi",
      returnAddress: "Shop 4, Saddar",
      hasPassword: true,
    },
    updateProfile: mockUpdateProfile,
    deactivateAccount: vi.fn(),
    changePassword: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock("@/hooks/useSellerReviews", () => ({
  useSellerReviews: () => ({
    reviews: [],
    stats: { average: 0, count: 0 },
    loading: false,
    error: "",
  }),
}));

vi.mock("@/services/api", () => ({
  default: {
    getSellerStripeStatus: vi.fn().mockResolvedValue({ stripeConnected: false }),
    getSellerStripePayouts: vi.fn().mockResolvedValue({
      stripeConnected: false,
      totalEarnedLabel: "PKR 0",
      recentPayouts: [],
      stripeBalance: { availableLabel: "—", pendingLabel: "—" },
    }),
    getSellerVerification: vi.fn().mockResolvedValue({
      verification: { verificationStatus: "approved" },
    }),
    createSellerStripeConnect: vi.fn(),
    openSellerStripeDashboard: vi.fn(),
  },
}));

describe("SellerProfile — return address section", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("FE-RC-07: displays seller return contact in profile view", () => {
    render(
      <MemoryRouter>
        <SellerProfile />
      </MemoryRouter>,
    );

    expect(screen.getByText("Return address (for renters)")).toBeInTheDocument();
    expect(screen.getByText("Zara Returns Desk")).toBeInTheDocument();
    expect(screen.getByText("03009998877")).toBeInTheDocument();
    expect(screen.getByText("Rawalpindi")).toBeInTheDocument();
    expect(screen.getByText("Shop 4, Saddar")).toBeInTheDocument();
  });

  it("FE-RC-08: saves return contact fields from edit form", async () => {
    const user = userEvent.setup();
    mockUpdateProfile.mockResolvedValue({
      name: "Zara Seller",
      returnContactName: "Updated Return Name",
      returnPhone: "03005556666",
      returnCity: "Lahore",
      returnAddress: "Updated Return Street",
    });

    render(
      <MemoryRouter>
        <SellerProfile />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /edit profile/i }));

    const returnNameInput = screen.getByLabelText("Contact Name");
    await user.clear(returnNameInput);
    await user.type(returnNameInput, "Updated Return Name");

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveButton);

    expect(mockUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        returnContactName: "Updated Return Name",
        returnPhone: "03009998877",
        returnCity: "Rawalpindi",
        returnAddress: "Shop 4, Saddar",
      }),
    );
  });
});
