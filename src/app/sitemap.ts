import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://kroooo.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // 動的ページは後で追加
    // {
    //   url: 'https://kroooo.com/location/[id]',
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // },
  ];
}
