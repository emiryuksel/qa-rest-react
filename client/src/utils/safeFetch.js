// client/src/utils/safeFetch.js
export async function safeFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      window.location.href = "/login?redirected=true";
      return null;
    }

    return res;
  } catch (err) {
    console.error("safeFetch error:", err);
    throw err;
  }
}
