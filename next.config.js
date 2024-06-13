module.exports = {
  env: {
    //  dataDragon
    leaguePatch: "14.12.1",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ddragon.leagueoflegends.com",
        port: "",
      },
      {
        protocol: "http",
        hostname: "ddragon.leagueoflegends.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "raw.communitydragon.org",
        port: "",
      },
      {
        protocol: "http",
        hostname: "raw.communitydragon.org",
        port: "",
      },
    ],
  },
};
