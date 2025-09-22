// Very small phone normalization helper (E.164). For production use libphonenumber.
export function toE164(input: string, defaultCountry = "IN") {
  if (!input) throw new Error("empty phone");
  let s = input.trim();
  // remove spaces, dashes, parentheses
  s = s.replace(/[\s\-()]/g, "");
  if (s.startsWith("+")) return s;
  if (s.startsWith("0")) {
    // drop leading zero
    s = s.replace(/^0+/, "");
  }
  // if it looks like local Indian mobile (10 digits), prefix +91
  if (/^[6-9]\d{9}$/.test(s) && defaultCountry === "IN") {
    return `+91${s}`;
  }
  // fallback: if it already has country code digits, prefix +
  if (/^\d{8,15}$/.test(s)) return `+${s}`;
  throw new Error("invalid phone format");
}
