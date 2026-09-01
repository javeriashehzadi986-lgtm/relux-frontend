import { describe, expect, it, vi } from "vitest";
import { hydrateBuyerOrder } from "./dressCatalog";

vi.mock("./catalogStore", () => ({
  getPublicListingById: vi.fn(() => null),
}));

describe("dressCatalog — buyer order hydration", () => {
  it("FE-RC-01: passes through sellerReturnContact from API order", () => {
    const order = {
      id: "order-1",
      dressId: "dress-1",
      type: "rental",
      status: "rental-active",
      size: "M",
      amountPkr: 50000,
      productTitle: "Silk Lehenga",
      sellerReturnContact: {
        name: "Ayesha Seller",
        phone: "03001234567",
        email: "ayesha@example.com",
        city: "Lahore",
        address: "12 Mall Road",
      },
    };

    const hydrated = hydrateBuyerOrder(order);

    expect(hydrated.sellerReturnContact).toEqual(order.sellerReturnContact);
    expect(hydrated.title).toBe("Silk Lehenga");
  });

  it("FE-RC-02: keeps returnContactReady flag from API", () => {
    const hydrated = hydrateBuyerOrder({
      id: "order-2",
      dressId: "dress-2",
      type: "rental",
      status: "rental-active",
      returnContactReady: true,
      sellerReturnContact: null,
    });

    expect(hydrated.returnContactReady).toBe(true);
    expect(hydrated.sellerReturnContact).toBeNull();
  });
});
