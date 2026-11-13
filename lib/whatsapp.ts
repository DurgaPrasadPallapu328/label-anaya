export const whatsappMessage = "Hi Label Anaya! I'm visiting your website and would like to enquire about your collections.";

/** Validate international digit-only syntax; account availability is verified by the owner. */
export function getWhatsAppUrl(number: string | undefined): string | null {
  if (!number || !/^[1-9]\d{7,14}$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage)}`;
}
