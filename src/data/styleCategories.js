export const STYLE_CATEGORIES = [
  "Casual",
  "Formal",
  "Party",
  "Traditional",
  "Bridal",
  "Sports Wear",
  "Winter Wear",
  "Summer Wear",
];

export function getStyleOptionsForCategory(mainCategory) {
  if (mainCategory === "Male") {
    return STYLE_CATEGORIES.map((style) =>
      style === "Bridal" ? "Groom" : style,
    );
  }
  if (mainCategory === "Kids") {
    return STYLE_CATEGORIES.filter((style) => style !== "Bridal");
  }
  return STYLE_CATEGORIES;
}
