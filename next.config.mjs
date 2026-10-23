const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Folder-per-route URLs — most reliable on static/shared hosting.
  trailingSlash: true,
  // Tree-shake icon imports (Phosphor isn't in Next's default list).
  // The separate webpack build worker crashes (0xC0000409) under Node 24 on
  // Windows; compiling in the main process is slower but reliable.
  experimental: { optimizePackageImports: ["@phosphor-icons/react"], webpackBuildWorker: false },
  // Static HTML export in production → an `out/` folder of plain files that
  // works on Vercel *and* shared hosting (matches the sibling case studies).
  // Dev server runs normally so next-intl + fonts hot-reload during build.
  ...(isProd && { output: "export", images: { unoptimized: true } }),
};

export default nextConfig;
