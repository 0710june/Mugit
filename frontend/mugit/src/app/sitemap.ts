import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://mugit.site/",
      lastModified: new Date(),
      alternates: {
        languages: {
          en: "https://mugit.site/en",
          ko: "https://mugit.site/ko",
        },
      },
    },
    {
      url: "https://mugit.site/trends",
      lastModified: new Date(),
      alternates: {
        languages: {
          en: "https://mugit.site/en/trends",
          ko: "https://mugit.site/ko/trends",
        },
      },
    },
    {
      url: "https://mugit.site/support",
      lastModified: new Date(),
      alternates: {
        languages: {
          en: "https://mugit.site/en/support",
          ko: "https://mugit.site/ko/support",
        },
      },
    },
  ];
}
