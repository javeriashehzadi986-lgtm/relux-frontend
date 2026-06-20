export function Button({ children, variant = "default", className = "" }) {
  let variantClasses = "";

  if (variant === "default") {
    variantClasses =
      "bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded transition";
  }

  if (variant === "outline") {
    variantClasses =
      "border border-black px-4 py-2 rounded hover:bg-gray-100 transition";
  }

  if (variant === "destructive") {
    variantClasses =
      "bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded transition";
  }

  return (
    <button className={`${variantClasses} ${className}`}>
      {children}
    </button>
  );
}