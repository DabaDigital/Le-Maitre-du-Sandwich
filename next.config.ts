import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 is used for the stacked ingredient layers so edges stay clean where they overlap.
    qualities: [75, 90],
  },
};

export default nextConfig;
