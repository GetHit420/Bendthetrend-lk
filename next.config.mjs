/** @type {import('next').NextConfig} */
const nextConfig = {
  // Photos in /public/images are resized and converted to WebP for each device automatically
  images: {
    formats: ["image/webp"],
    qualities: [75],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [160, 256, 384],
    minimumCacheTTL: 2678400, // keep optimised copies for 31 days
  },
  // Old .html addresses keep working if anyone has them bookmarked
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/bend-the-trend-home.html", destination: "/", permanent: true },
      { source: "/customise-my-outfit.html", destination: "/customise-my-outfit", permanent: true },
      { source: "/our-works.html", destination: "/our-works", permanent: true },
      { source: "/blog.html", destination: "/blog", permanent: true },
      { source: "/contact-us.html", destination: "/contact-us", permanent: true },
    ];
  },
};
export default nextConfig;
