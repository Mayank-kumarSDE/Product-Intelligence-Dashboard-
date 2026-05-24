const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function getServerToken() {
  if (typeof window !== "undefined") return "";
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    return cookieStore.get("quantacus_token")?.value || "";
  } catch {
    return "";
  }
}

function getClientToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("quantacus_token") || "";
}

export async function api(path, options = {}) {
  const token = typeof window === "undefined" ? await getServerToken() : getClientToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...options,
    headers
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
