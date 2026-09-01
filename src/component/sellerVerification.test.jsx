import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SellerVerification from "./sellerVerification";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
  };
});

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: "user-1",
      role: "buyer",
      email: "buyer@example.com",
      name: "Buyer Test",
      phone: "03001112222",
      city: "Lahore",
      returnAddress: "",
    },
    loading: false,
    isAuthenticated: true,
    isSeller: false,
    isAdmin: false,
    submitSellerVerification: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock("@/services/api", () => ({
  default: {
    getSellerStripeStatus: vi.fn().mockResolvedValue({ stripeConnected: false }),
    createSellerStripeConnect: vi.fn(),
    updateSellerDocuments: vi.fn(),
  },
}));

describe("SellerVerification — return address fields", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("FE-RC-06: renders required return contact fields for buyer applicants", () => {
    render(
      <MemoryRouter>
        <SellerVerification />
      </MemoryRouter>,
    );

    expect(screen.getByText("Return Address (for renters)")).toBeInTheDocument();
    expect(screen.getByLabelText("Contact Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Return Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("Return City")).toBeInTheDocument();
    expect(screen.getByLabelText("Return Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Contact Name")).toHaveValue("Buyer Test");
    expect(screen.getByLabelText("Return Phone")).toHaveValue("03001112222");
    expect(screen.getByLabelText("Return City")).toHaveValue("Lahore");
  });
});
