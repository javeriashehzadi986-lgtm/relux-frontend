function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export async function prepareImageForUpload(file) {
  if (!file) {
    throw new Error("Image file is required");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  if (file.size <= MAX_IMAGE_BYTES) {
    return readFileAsDataUrl(file);
  }

  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = originalDataUrl;
  });

  const scale = Math.min(1, 1400 / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, width, height);

  let quality = 0.82;
  let compressed = canvas.toDataURL("image/jpeg", quality);
  while (compressed.length > MAX_IMAGE_BYTES * 1.37 && quality > 0.45) {
    quality -= 0.1;
    compressed = canvas.toDataURL("image/jpeg", quality);
  }

  if (compressed.length > MAX_IMAGE_BYTES * 1.37) {
    throw new Error("Image is too large even after compression. Try a smaller photo.");
  }

  return compressed;
}

export async function prepareImageSource(src) {
  if (!src) return "";
  if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  if (src.startsWith("blob:")) {
    const response = await fetch(src);
    const blob = await response.blob();
    const file = new File([blob], "listing-image.jpg", {
      type: blob.type || "image/jpeg",
    });
    return prepareImageForUpload(file);
  }
  return src;
}

export async function prepareImageList(images) {
  const prepared = await Promise.all(images.map((src) => prepareImageSource(src)));
  return prepared.filter(Boolean);
}
