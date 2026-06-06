export interface NewsSource {
  id: string;
  tenantId: string;
  slug: string;
  title: string;
  sourceType?: string;
  trustTier?: string;
  status: string;
  locale?: string;
  region?: string;
  homepageUrl?: string;
}
