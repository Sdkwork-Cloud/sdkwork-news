export interface NewsEditorialReadiness {
  ready: boolean;
  canPublish: boolean;
  canSchedule: boolean;
  canArchive: boolean;
  canFeature: boolean;
  issues: string[];
}
