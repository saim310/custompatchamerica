export const MAX_ARTWORK_BYTES = 3 * 1024 * 1024;
export const MAX_QUOTE_BYTES = MAX_ARTWORK_BYTES + 32 * 1024;
export const ARTWORK_ACCEPT = ".png,.jpg,.jpeg,.webp,.pdf";
export const PATCH_TYPES = ["Embroidered", "PVC", "Woven", "Leather", "Chenille", "Sublimated"];
export const PATCH_BACKINGS = ["Sew-On", "Iron-On", "Peel-and-Stick", "Hook-and-Loop", "Not sure"];
export type QuoteErrors = Partial<Record<"name" | "email" | "phone" | "company" | "patchType" | "quantity" | "backing" | "artwork" | "message", string>>;
export interface QuoteDetails { name: string; email: string; phone: string; company: string; patchType: string; quantity: number; message: string; backing?: string }

export function validateQuote(form: FormData): { details: QuoteDetails; errors: QuoteErrors; artwork: File | null } {
  const value = (key: string) => typeof form.get(key) === "string" ? (form.get(key) as string).trim() : "";
  const details: QuoteDetails = { name: value("name"), email: value("email"), phone: value("phone"), company: value("company"), patchType: value("patchType"), quantity: Number(value("quantity")), message: value("message") };
  const errors: QuoteErrors = {};
  if (form.get("source") === "quote-popup") {
    const backing = value("backing");
    if (PATCH_BACKINGS.includes(backing)) details.backing = backing;
    else errors.backing = "Choose a backing option.";
  }
  if (details.name.length < 2 || details.name.length > 100) errors.name = "Enter your full name (2–100 characters).";
  if (details.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) errors.email = "Enter a valid email address.";
  if (details.phone.length > 40 || !/^[+\d\s().-]{7,40}$/.test(details.phone) || details.phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a valid phone number.";
  if (details.company.length > 120) errors.company = "Keep the company name under 120 characters.";
  if (!PATCH_TYPES.includes(details.patchType)) errors.patchType = "Choose a patch type.";
  if (!Number.isInteger(details.quantity) || details.quantity < 1 || details.quantity > 100000) errors.quantity = "Enter a quantity between 1 and 100,000.";
  if (details.message.length > 4000) errors.message = "Keep your message under 4,000 characters.";
  const upload = form.get("artwork");
  const artwork = upload instanceof File && upload.size > 0 ? upload : null;
  if (artwork && (artwork.size > MAX_ARTWORK_BYTES || !/\.(png|jpe?g|webp|pdf)$/i.test(artwork.name) || !["image/png", "image/jpeg", "image/webp", "application/pdf"].includes(artwork.type))) errors.artwork = "Choose a PNG, JPG, WebP or PDF up to 3 MB.";
  return { details, errors, artwork };
}

export function validArtworkSignature(bytes: Uint8Array, type: string) {
  const start = (signature: number[]) => signature.every((byte, index) => bytes[index] === byte);
  if (type === "image/png") return start([137, 80, 78, 71, 13, 10, 26, 10]);
  if (type === "image/jpeg") return start([255, 216, 255]);
  if (type === "application/pdf") return start([37, 80, 68, 70, 45]);
  if (type === "image/webp") return start([82, 73, 70, 70]) && [87, 69, 66, 80].every((byte, index) => bytes[index + 8] === byte);
  return false;
}
