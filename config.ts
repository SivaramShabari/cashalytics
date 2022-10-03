export const NEXT_URL =
  typeof window !== undefined
    ? window.location.protocol + "//" + window.location.host
    : process.env.NEXT_URL || "http://192.168.29.114:3000";
