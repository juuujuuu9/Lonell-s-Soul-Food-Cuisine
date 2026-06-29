export function adminApiError(status: 401 | 403): Response {
  const message = status === 401 ? "Sign in required" : "Admin access required";
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
