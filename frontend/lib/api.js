const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...options
  });
  const payload = await response.json();

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Request failed");
  }

  return payload.data;
}

export async function uploadFile(path, file, options = {}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("enhanceTitles", String(Boolean(options.enhanceTitles)));

  return api(path, {
    method: "POST",
    body: formData
  });
}
