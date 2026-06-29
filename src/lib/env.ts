/** Read at call time — avoids Vite inlining env at build (breaks Vercel runtime vars). */
export function serverEnv(key: string): string | undefined {
  return process.env[key];
}

export function isSmsEnabled(): boolean {
  const raw = process.env["SMS_ENABLED"];
  if (!raw) return false;
  return raw.trim().toLowerCase() === "true";
}
