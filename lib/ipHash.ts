import crypto from "crypto";

const SALT = (process.env.AUTH_SECRET ?? "canary-inn-salt").slice(0, 16);

export function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(`${SALT}|${ip}`).digest("hex").slice(0, 32);
}