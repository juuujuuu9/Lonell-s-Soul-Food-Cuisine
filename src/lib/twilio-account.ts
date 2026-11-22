import { serverEnv } from "./env";

export type TwilioAccountInfo = {
  configured: boolean;
  status?: string;
  friendlyName?: string;
  balance?: string;
  currency?: string;
  error?: string;
};

/** Live Twilio account status + balance for the admin dashboard. */
export async function fetchTwilioAccountInfo(): Promise<TwilioAccountInfo> {
  const accountSid = serverEnv("TWILIO_ACCOUNT_SID");
  const authToken = serverEnv("TWILIO_AUTH_TOKEN");

  if (!accountSid || !authToken) {
    return { configured: false, error: "TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN not set" };
  }

  try {
    const { default: twilio } = await import("twilio");
    const client = twilio(accountSid, authToken);

    const [account, balance] = await Promise.all([
      client.api.v2010.accounts(accountSid).fetch(),
      client.balance.fetch().catch(() => null),
    ]);

    return {
      configured: true,
      status: account.status,
      friendlyName: account.friendlyName,
      balance: balance?.balance,
      currency: balance?.currency,
    };
  } catch (err) {
    return {
      configured: true,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export function formatTwilioBalance(info: TwilioAccountInfo): string | null {
  if (info.balance == null || info.balance === "") return null;
  const amount = Number(info.balance);
  if (Number.isNaN(amount)) return `${info.balance} ${info.currency ?? ""}`.trim();
  const currency = info.currency ?? "USD";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

if (import.meta.env?.DEV) {
  console.assert(formatTwilioBalance({ configured: true, balance: "12.5", currency: "USD" }) === "$12.50", "usd format");
  console.assert(formatTwilioBalance({ configured: true }) === null, "missing balance");
}
