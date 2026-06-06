export interface MediaResource {
  id?: string;
  kind: 'image' | 'video' | 'audio' | 'voice' | 'document' | 'archive' | 'other';
  source: 'drive' | 'external_url' | 'provider_asset' | 'generated';
  uri?: string;
  url?: string;
  publicUrl?: string;
  mimeType?: string;
  sizeBytes?: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
  altText?: string;
  title?: string;
  metadata?: Record<string, unknown>;
}
