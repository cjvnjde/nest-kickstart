import { scryptSync, timingSafeEqual } from "node:crypto";

export function compareHash(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");
  const hashedBuffer = scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  return timingSafeEqual(hashedBuffer, keyBuffer);
}
