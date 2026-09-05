import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProfileMyOrders from "./profileMyOrders";

const mockUseBuyerOrders = vi.fn();

vi.mock("@/hooks/useBuyerOrders", () => ({
  useBuyerOrders: () => mockUseBuyerOrders(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

function renderOrders(orders) {
  mockUseBuyerOrders.mockReturnValue({
    orders,
    loading: false,
    error: "",
    cancelOrder: vi.fn(),
    removeOrder: vi.fn(),
    confirmReceived: vi.fn(),
    markReturned: vi.fn(),
    disputeSaleDelivery: vi.fn(),
    disputeDelivery: vi.fn(),
  });

  return render(
    <MemoryRouter>
      <ProfileMyOrders />
    </MemoryRouter>,
  );
}

describe("ProfileMyOrders — seller return contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("FE-RC-03: shows seller name, phone, and address for active rental", () => {
    renderOrders([
      {
        id: "rental-1",
        dressId: "dress-1",
        type: "rental",
        typeLabel: "Rental",
        status: "rental-active",
        statusLabel: "Received by Buyer",
        title: "Velvet Lehenga",
        brand: "Relux",
        image: "",
        amount: "Rs. 50,000",
        variant: "Size: M",
        meta: [],
        actions: [{ id: "mark-returned", label: "Mark as Returned", variant: "primary" }],
        sellerReturnContact: {
          name: "Sara Ahmed",
          phone: "03009998877",
          email: "sara@example.com",
          city: "Karachi",
          address: "Clifton Block 5",
        },
      },
    ]);

    expect(screen.getByText("Return to seller")).toBeInTheDocument();
    expect(screen.getByText("Sara Ahmed")).toBeInTheDocument();
    expect(screen.getByText("03009998877")).toBeInTheDocument();
    expect(screen.getByText(/Clifton Block 5, Karachi/)).toBeInTheDocument();
    expect(screen.getByText("sara@example.com")).toBeInTheDocument();
    expect(
      screen.getByText(/Ship or drop off the item to this address before marking it as returned/),
    ).toBeInTheDocument();
  });

  it("FE-RC-04: shows fallback when return contact is missing", () => {
    renderOrders([
      {
        id: "rental-2",
        dressId: "dress-2",
        type: "rental",
        typeLabel: "Rental",
        status: "rental-active",
        statusLabel: "Received by Buyer",
        title: "Designer Gown",
        brand: "Relux",
        image: "",
        amount: "Rs. 40,000",
        variant: "Size: L",
        meta: [],
        actions: [],
        sellerReturnContact: null,
        returnContactReady: false,
      },
    ]);

    expect(
      screen.getByText(/Return contact is not available for this order/),
    ).toBeInTheDocument();
  });

  it("FE-RC-05: does not show return panel for purchase orders", () => {
    renderOrders([
      {
        id: "purchase-1",
        dressId: "dress-3",
        type: "purchase",
        typeLabel: "Purchase",
        status: "delivered",
        statusLabel: "Delivered",
        title: "Sherwani",
        brand: "Relux",
        image: "",
        amount: "Rs. 80,000",
        variant: "Size: L",
        meta: [],
        actions: [],
      },
    ]);

    expect(screen.queryByText("Return to seller")).not.toBeInTheDocument();
  });
});
