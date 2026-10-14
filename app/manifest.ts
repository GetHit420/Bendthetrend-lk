import type { MetadataRoute } from "next";

// Used when someone adds the site to their phone's home screen, and by Google/Android
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bend the Trend — Customized Clothing",
    short_name: "Bend the Trend",
    description: "Made-to-measure bridal gowns, sarees and occasion wear in Sri Lanka.",
    start_url: "/",
    display: "standalone",
    background_color: "#1B0D15",
    theme_color: "#1B0D15",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
