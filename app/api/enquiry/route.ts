// Receives the "Start your design" form and passes it to the atelier's Google Sheet
// (see google-apps-script/Code.gs), then optionally pings the owner on WhatsApp.
//
// Settings (in .env.local and on your host):
//   ENQUIRY_SCRIPT_URL   the Web app URL from the Google Apps Script deployment
//   ENQUIRY_SECRET       the same phrase as SECRET in Code.gs
//   CALLMEBOT_PHONE      optional: owner's WhatsApp number with country code, e.g. +94771234567
//   CALLMEBOT_APIKEY     optional: the key CallMeBot sends you (see README)

export const maxDuration = 30;

const MAX_IMAGES = 5;
const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // per picture, after the browser has resized it

type Img = { data: string; type: string };
type Body = {
  name?: string; whatsapp?: string; outfit?: string; date?: string; budget?: string;
  location?: string; idea?: string; images?: Img[]; company?: string; // "company" is a hidden spam trap
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** 077 123 4567 → 94771234567 (Sri Lanka); +44 7700 900123 → 447700900123 */
function intlNumber(raw: string) {
  const d = raw.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return d.slice(1);
  if (d.startsWith("00")) return d.slice(2);
  if (/^0\d{9}$/.test(d)) return "94" + d.slice(1);
  return d;
}

async function notifyOwnerOnWhatsApp(text: string) {
  const phone = process.env.CALLMEBOT_PHONE, key = process.env.CALLMEBOT_APIKEY;
  if (!phone || !key) return;
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(key)}`;
  try {
    await fetch(url, { signal: AbortSignal.timeout(8000) });
  } catch (e) {
    console.error("[enquiry] WhatsApp alert failed (the enquiry itself was saved):", e);
  }
}

export async function POST(req: Request) {
  const scriptUrl = process.env.ENQUIRY_SCRIPT_URL;
  const secret = process.env.ENQUIRY_SECRET;
  if (!scriptUrl || !secret) {
    // Not set up yet: the form falls back to opening WhatsApp with the details filled in
    return Response.json({ ok: false, notConfigured: true }, { status: 503 });
  }

  let b: Body;
  try { b = await req.json(); } catch { return Response.json({ ok: false, error: "Bad request" }, { status: 400 }); }

  if (b.company) return Response.json({ ok: true }); // a bot filled the hidden field; pretend it worked

  const name = str(b.name, 120), whatsapp = str(b.whatsapp, 40), outfit = str(b.outfit, 80);
  if (!name || whatsapp.replace(/\D/g, "").length < 7 || !outfit) {
    return Response.json({ ok: false, error: "Please add your name, WhatsApp number and what we’ll be making." }, { status: 400 });
  }

  const images: Img[] = [];
  for (const img of (Array.isArray(b.images) ? b.images : []).slice(0, MAX_IMAGES)) {
    if (!img || typeof img.data !== "string" || !/^image\/(jpeg|png|webp|gif|heic|heif)$/.test(img.type)) continue;
    if (img.data.length * 0.75 > MAX_IMAGE_BYTES) continue;
    images.push({ data: img.data, type: img.type });
  }

  const intl = intlNumber(whatsapp);
  const replyLink = `https://wa.me/${intl}?text=${encodeURIComponent(`Hello ${name}, thank you for your enquiry to Bend the Trend about your ${outfit.toLowerCase()}.`)}`;

  const enquiry = {
    secret, name, whatsapp, outfit, replyLink, images,
    date: str(b.date, 20), budget: str(b.budget, 40), location: str(b.location, 40), idea: str(b.idea, 3000),
  };

  let saved: { ok?: boolean; folderUrl?: string; error?: string };
  try {
    const r = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enquiry),
      redirect: "follow",
      signal: AbortSignal.timeout(25000),
    });
    saved = await r.json();
  } catch (e) {
    console.error("[enquiry] Could not reach the Google script:", e);
    return Response.json({ ok: false, error: "We couldn’t send your request just now." }, { status: 502 });
  }
  if (!saved?.ok) {
    console.error("[enquiry] Google script refused the enquiry:", saved?.error);
    return Response.json({ ok: false, error: "We couldn’t send your request just now." }, { status: 502 });
  }

  await notifyOwnerOnWhatsApp(
    [
      `✦ New enquiry — ${outfit}`,
      `${name} · ${whatsapp}`,
      enquiry.date ? `Occasion: ${enquiry.date}` : "",
      enquiry.budget ? `Budget: ${enquiry.budget}` : "",
      images.length ? `${images.length} picture${images.length > 1 ? "s" : ""}: ${saved.folderUrl}` : "",
      `Reply: https://wa.me/${intl}`,
    ].filter(Boolean).join("\n"),
  );

  return Response.json({ ok: true });
}
