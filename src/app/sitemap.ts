import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase'; // Use singleton
import { PREFECTURES } from '@/lib/prefectures';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const getUrl = (path: string) => `https://kroooo.com${path}`;

  // 1. Static Pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: getUrl(''),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: getUrl('/doc/privacy'), // Example
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 2. Prefecture Pages
  const prefectureRoutes = PREFECTURES.map(pref => ({
    url: getUrl(`/${pref.id}`),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 3. Location Pages (Fetch IDs)
  // Use simple fetch since this runs at build time/request time (on server)
  // Note: sitemap.ts runs in Node environment usually
  const { data: locations } = await supabase
    .from('carwash_locations')
    .select('id, updated_at')
    .eq('is_active', true);

  const locationRoutes = (locations || []).map(loc => ({
    url: getUrl(`/location/${loc.id}`),
    lastModified: new Date(loc.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...routes, ...prefectureRoutes, ...locationRoutes];
}
