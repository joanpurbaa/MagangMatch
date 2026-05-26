import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "talentern.telkomuniversity.ac.id",
			},
		],
	},
};

export default nextConfig;
