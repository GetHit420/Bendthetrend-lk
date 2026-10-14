// ============ YOUR CONTACT DETAILS — change these in one place for the whole site ============
export const PHONE_DISPLAY = "077 217 1600"; // how the number is shown
export const PHONE_INTL = "94772171600"; // country code + number, no + or spaces
export const EMAIL = "hello@bendthetrend.lk";
export const INSTAGRAM = "#"; // paste your Instagram link here
export const DEFAULT_WA_MSG = "Hello Bend the Trend, I'd like to arrange a fitting.";

// Your address — one line per part, exactly as it should appear
export const ADDRESS = ["Mount Lavinia", "Sri Lanka"];

// The request form goes to your Google Sheet. Set it up with google-apps-script/Code.gs
// and the ENQUIRY_ settings in .env.local (see README "Form → Google Sheet").
// Until then the form opens WhatsApp with the details filled in instead.

export const TEL_HREF = `tel:+${PHONE_INTL}`;
export const waLink = (msg?: string) =>
  `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(msg || DEFAULT_WA_MSG)}`;

// Photos live in /public/images. File names can contain spaces.
export const img = (file: string) => `/images/${encodeURI(file)}`;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/customise-my-outfit", label: "Customise My Outfit" },
  { href: "/our-works", label: "Our Works" },
  { href: "/blog", label: "Blog" },
  { href: "/contact-us", label: "Contact Us" },
];

export const OUTFITS = [
  "Bridal gown",
  "Saree",
  "Statement dress",
  "Engagement dress",
  "Party dress",
  "Kids wear",
  "Occasion wear",
  "More than one outfit",
];

export const TESTIMONIALS = [
  { q: "I brought a Pinterest board and a photograph of my mother’s wedding. The gown they made held both, and it was entirely mine.", who: "Nethmi", what: "Bridal gown" },
  { q: "My saree was designed from nothing. The border carries the flowers from our garden. People still ask where it came from.", who: "Aishwarya", what: "Saree" },
  { q: "My engagement dress and my daughter’s flower-girl dress were made to match. Every fitting felt unhurried and personal.", who: "Rizna", what: "Engagement & kids wear" },
];
