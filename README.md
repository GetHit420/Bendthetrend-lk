# Bend the Trend — Next.js site

The five pages (Home, Customise My Outfit, Our Works, Blog, Contact Us) rebuilt in Next.js 16 + Tailwind CSS v4 with the same design, plus smooth scrolling and parallax.

## Run it

Needs Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

Deploys as-is to Vercel.

## Add your photos

Put your PNGs in `public/images/` with the same file names as before:

`Bridal 3.png`, `hero image 2.png`, `Bridal.png`, `bridal 1.png`, `2 bridal.png`, `bridal 4.png`, `bridal hero.png`, `saress.png`, `statment dress.png`, `engagement dress.png`, `party dress.png`, `occation dress.png`, `kids wear.png`, `work-11.png`, `work-12.png`

Until a photo is there, its frame shows the silk pattern, just like the original.

You can upload photos at full size: the site automatically makes small WebP copies for each screen size (a phone downloads a few hundred KB instead of several MB). Keep each original under about 10 MB.

## Live Google reviews

The home page carousel and the Our Works "In their words" section show your real Google rating, review count and latest reviews, and refresh themselves about every hour.

1. In [Google Cloud Console](https://console.cloud.google.com/), create a project, enable **Places API (New)**, and set up billing (Google requires a card; there is a free monthly allowance, see their pricing page).
2. Create an **API key** and restrict it to *Places API (New)*.
3. Find your **Place ID** with Google's [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id): search "Bend the Trend" and copy the ID (starts with `ChIJ`).
4. Copy `.env.example` to `.env.local` and paste both values. On Vercel, add the same two under Project → Settings → Environment Variables, then redeploy.

Without these (or if Google is ever unreachable) the site shows the written testimonials in `lib/site.ts` instead.
Change how often it refreshes, or hide low ratings, at the top of `lib/google-reviews.ts`.

Google only shares up to **5** reviews through its API, in its own "most relevant" order; the site links to the full list on Google Maps.

## Form → Google Sheet (with pictures)

When someone sends the "Start your design" form, the site keeps them on the page, shows a thank-you, and sends everything to **your Google account**:

- a new row in a Google Sheet (name, WhatsApp, outfit, date, budget, idea, a **Message them** link and a status column you can update),
- their pictures saved in a Google Drive folder (one folder per enquiry),
- an email to you with the details and the pictures attached,
- optionally, a WhatsApp message to your phone with a one-tap reply link.

**Set it up (about 10 minutes):**

1. Go to [sheets.new](https://sheets.new) and name the sheet "Bend the Trend enquiries".
2. In the sheet: **Extensions → Apps Script**. Delete the sample code, paste in all of `google-apps-script/Code.gs`, and click Save.
3. At the top of the script, change `SECRET` to a long random phrase.
4. Choose `setup` in the function menu and click **Run**. Allow the permissions Google asks for (it needs your Sheet, Drive and Gmail to save and email enquiries). An "Enquiries" tab appears.
5. Click **Deploy → New deployment**, choose **Web app**, set *Execute as: Me* and *Who has access: Anyone*, then click **Deploy** and copy the **Web app URL**.
6. In `.env.local` (and in your host's environment variables) set:
   ```
   ENQUIRY_SCRIPT_URL=the Web app URL
   ENQUIRY_SECRET=the same phrase as in step 3
   ```
7. Restart `npm run dev` (or redeploy) and send yourself a test enquiry.

If you change the script later: **Deploy → Manage deployments → Edit → Version: New version**, so the URL stays the same.

**Optional WhatsApp alert to your phone:** [CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/) is a free service that sends WhatsApp messages to your own number. Follow its instructions to get an API key (you send it one WhatsApp message), then set `CALLMEBOT_PHONE` (e.g. `+94771234567`) and `CALLMEBOT_APIKEY`. It's an independent service, not WhatsApp's official one; if it's ever down, enquiries are still saved and emailed.

Until `ENQUIRY_SCRIPT_URL` is set, the form opens WhatsApp with the details filled in, as before.

## Where to change things

| What | File |
|---|---|
| Phone, WhatsApp, email, Instagram, address | `lib/site.ts` |
| Request form → Google Sheet | `google-apps-script/Code.gs`, `.env.local` |
| Our Works pieces | `lib/works.ts` |
| Google reviews setup and refresh time | `.env.local`, `lib/google-reviews.ts` |
| Blog posts | `app/blog/page.tsx` (`POSTS`) |
| Colours, silk patterns, fonts | `app/globals.css` (Tailwind v4 theme is at the top) |
| Page text | `app/<page>/page.tsx` |
| Header logo | `public/brand/logo-mark.png` |
| Browser tab / Google / phone home-screen icon | `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`, `public/brand/icon-*.png` |

## Works on every device

- **Always dark plum**, whatever the phone or computer's light/dark setting.
- **Photos are optimised automatically** (`next/image`): resized per device, converted to WebP, lazy-loaded below the fold, cached for 31 days.
- **Frames are cut with `clip-path`**, which iPhone Safari honours, instead of rounded corners alone.
- **Phones and tablets get a lighter version**: no parallax inside frames, no blend modes, no photo shadows and no frosted-glass blur. These are what made older iPhones slow. Desktop keeps the full effects.
- Respects "Reduce Motion" in phone settings.
- Needs iOS 16.4+ / Android Chrome 111+ (anything from about 2023 on). iPhone 11 and newer can all update to this.

To test on real phones you don't own, BrowserStack or LambdaTest (both have free trials) let you open the live site on real iPhones and Androids.

## What's new in feel

- **Smooth scrolling** (Lenis) — wheel and anchor links glide; `#book` links land just under the header.
- **Parallax depth** — every silk frame moves its photo and its silk at different speeds; the hero arches drift at three depths; the floating note cards lag behind their arches.
- **Reveals** — headings rise in word by word, sections and grids fade up in sequence as you reach them.
- **Header** turns frosted once you scroll, with a thin gold reading-progress line.
- **Mobile booking bar** slides away while reading down and returns when you scroll up.
- **Testimonials** crossfade, auto-advance, and can be swiped.
- **FAQ, mobile menu, works filters and viewer** animate open and closed.
- Everything respects the visitor's "reduce motion" setting.
