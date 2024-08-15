import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mugit.site",
        port: "",
        // pathname: "/ko/**",
      },
    ],
  },
  output: "standalone",

  async rewrites() {
    return [
      {
        source: "/login",
        destination: "https://mugit.site/api/users/mocks/login?pk=1", // 배포된 백엔드 서버의 URL로 변경하세요.
        locale: false,
      },
      {
        source: "/patchprofile",
        destination: "https://mugit.site/api/users/profiles", // 배포된 백엔드 서버의 URL로 변경하세요.
        locale: false,
      },
      //   {
      //     source: "/note",
      //     destination: "https://mugit.site/api/flows/note", // 배포된 백엔드 서버의 URL로 변경하세요.
      //     locale: false,
      //   },
    ];
  },
  trailingSlash: true,
};

export default withNextIntl(nextConfig);
