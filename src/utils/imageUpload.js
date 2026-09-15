import api from "@/services/api";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function dataUrlToFile(dataUrl, fileName = "image.jpg") {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, {
    type: blob.type || "image/jpeg",
  });
}

export async function prepareImageForUpload(file) {
  if (!file) {
    throw new Error("Image file is required");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  if (file.size <= MAX_IMAGE_BYTES) {
    return file;
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

  return dataUrlToFile(compressed, file.name || "listing-image.jpg");
}

export async function uploadListingImage(file) {
  const prepared = await prepareImageForUpload(file);
  const data = await api.uploadListingImage(prepared);
  return data.url;
}

export async function uploadVerificationImage(file) {
  const prepared = await prepareImageForUpload(file);
  const data = await api.uploadVerificationImage(prepared);
  return data.url;
}

export async function uploadSupportImage(file) {
  const prepared = await prepareImageForUpload(file);
  const data = await api.uploadSupportImage(prepared);
  return data.url;
}

export async function uploadChatImage(file) {
  const prepared = await prepareImageForUpload(file);
  const data = await api.uploadChatImage(prepared);
  return data.url;
}

export async function resolveListingImageSource(src, fileMap) {
  if (!src) return "";
  if (src.startsWith("https://") || src.startsWith("http://")) {
    return src;
  }
  if (src.startsWith("data:")) {
    return src;
  }
  if (src.startsWith("blob:")) {
    const file = fileMap?.get(src);
    if (!file) {
      throw new Error("Could not read one of the selected images. Please re-add it.");
    }
    return uploadListingImage(file);
  }
  return src;
}

export async function prepareImageList(images, fileMap) {
  const prepared = await Promise.all(
    images.map((src) => resolveListingImageSource(src, fileMap)),
  );
  return prepared.filter(Boolean);
}

/** @deprecated Use uploadListingImage — kept for any legacy callers */
export async function prepareImageSource(src, fileMap) {
  return resolveListingImageSource(src, fileMap);
}

export async function prepareImageListLegacy(images) {
  return prepareImageList(images, new Map());
}
