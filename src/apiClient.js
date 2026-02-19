const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options) {
  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const data = await response.json();
      if (data?.error) {
        message = data.error;
      }
    } catch {
      // no-op
    }
    throw new Error(message);
  }
  return response.json();
}

export async function fetchContent() {
  return request("/content");
}

export async function fetchAdminContent() {
  return request("/admin/content");
}

export async function updateAdminContent(payload) {
  return request("/admin/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function createOrder(payload) {
  return request("/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function createContactMessage(payload) {
  return request("/contact-messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
