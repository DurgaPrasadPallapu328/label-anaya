import { getWhatsAppUrl } from "@/lib/whatsapp";
import "./whatsapp-contact.css";

export function WhatsAppContact() {
  const href = getWhatsAppUrl(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);

  return (
    <>
      <div className="whatsapp-contact-space" aria-hidden="true" />
      <div className="floating-social-contact">
      <a className="floating-social-button instagram-contact" href="https://www.instagram.com/styledbyanaya._/" target="_blank" rel="noopener noreferrer" aria-label="Follow Styled by Anaya on Instagram" title="Follow us">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" focusable="false">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" />
        </svg>
      </a>
      {href && <a className="floating-social-button whatsapp-contact" href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat with Label Anaya on WhatsApp" title="Chat with us">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M20.52 3.48A11.85 11.85 0 0 0 12.04 0C5.45 0 .08 5.37.08 11.97c0 2.11.55 4.17 1.6 5.99L0 24l6.19-1.62a11.96 11.96 0 0 0 5.84 1.49h.01c6.59 0 11.96-5.37 11.96-11.97 0-3.2-1.24-6.2-3.48-8.42ZM12.04 21.85a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.67.96.98-3.58-.24-.37a9.89 9.89 0 0 1-1.51-5.3c0-5.48 4.45-9.94 9.94-9.94a9.87 9.87 0 0 1 7.03 2.91 9.88 9.88 0 0 1 2.91 7.04c0 5.48-4.46 9.87-10.04 9.87Zm5.45-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
        </svg>
      </a>}
      </div>
    </>
  );
}
