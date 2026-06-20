export function Input({
  type = "text",
  placeholder = "",
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="border border-gray-300 rounded px-3 py-2"
    />
  );
}