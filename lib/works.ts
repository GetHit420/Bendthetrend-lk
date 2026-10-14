import type { Silk } from "@/components/Fabric";

// ============ YOUR WORK — add a piece by copying one block ============
// photo: file name in /public/images (cut-out PNGs with a transparent background look best).
// type: the filter it appears under — Bridal, Sarees, Dresses or Kids.
// Until a photo exists, the slot shows "Add your photo" on the silk.
export type Piece = {
  type: "Bridal" | "Sarees" | "Dresses" | "Kids";
  title: string;
  desc: string;
  fabric: string;
  work: string;
  time: string;
  photo: string;
  silk: Silk;
};

export const WORKS: Piece[] = [
  { type: "Bridal", title: "Ivory lace bridal saree", desc: "Hand-beaded lace with pearl flowers, worn with a matching high-neck hijab and a long tulle veil.", fabric: "Tulle and lace", work: "Pearl and floral beadwork", time: "10–12 weeks", photo: "bridal 1.png", silk: "rose" },
  { type: "Bridal", title: "Champagne anarkali", desc: "A full anarkali covered in gold and ivory embroidery, with a heavily bordered dupatta.", fabric: "Net", work: "Hand embroidery and sequins", time: "4–6 weeks", photo: "Bridal.png", silk: "plum" },
  { type: "Sarees", title: "Emerald georgette saree", desc: "Deep green georgette with a gold embroidered border and a matching full-sleeve blouse.", fabric: "Georgette", work: "Zari embroidery", time: "4–8 weeks", photo: "saress.png", silk: "pearl" },
  { type: "Dresses", title: "Mauve embroidered anarkali", desc: "Soft mauve with pink and gold floral work, finished with a sequinned dupatta.", fabric: "Net", work: "Floral and sequin embroidery", time: "4–6 weeks", photo: "statment dress.png", silk: "noir" },
  { type: "Dresses", title: "Plum pleated dress", desc: "Fine pleats, a sculpted ruffle across the shoulders and a matching hijab.", fabric: "Pleated chiffon", work: "Hand-set ruffles", time: "3–4 weeks", photo: "party dress.png", silk: "emerald" },
  { type: "Dresses", title: "Sage occasion gown", desc: "Sheer balloon sleeves and a bodice of silver embroidery over a full sage skirt.", fabric: "Tulle", work: "Silver thread and beadwork", time: "3–4 weeks", photo: "occation dress.png", silk: "crimson" },
  { type: "Kids", title: "Blush flower-girl gown", desc: "Layered ruffles, hand-made 3D flowers and a sheer cape from the shoulders.", fabric: "Organza", work: "3D flowers and beading", time: "2–3 weeks", photo: "kids wear.png", silk: "lilac" },
  { type: "Bridal", title: "Piece 8 title", desc: "Describe this piece in one or two sentences.", fabric: "Fabric", work: "Embroidery or details", time: "Weeks to make", photo: "bridal hero.png", silk: "ivory" },
  { type: "Sarees", title: "Piece 9 title", desc: "Describe this piece in one or two sentences.", fabric: "Fabric", work: "Embroidery or details", time: "Weeks to make", photo: "Bridal 3.png", silk: "sky" },
  { type: "Dresses", title: "Piece 10 title", desc: "Describe this piece in one or two sentences.", fabric: "Fabric", work: "Embroidery or details", time: "Weeks to make", photo: "statment dress.png", silk: "marigold" },
  { type: "Dresses", title: "Piece 11 title", desc: "Describe this piece in one or two sentences.", fabric: "Fabric", work: "Embroidery or details", time: "Weeks to make", photo: "work-11.png", silk: "rose" },
  { type: "Kids", title: "Piece 12 title", desc: "Describe this piece in one or two sentences.", fabric: "Fabric", work: "Embroidery or details", time: "Weeks to make", photo: "work-12.png", silk: "emerald" },
];
