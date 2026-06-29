export interface NewsExperiment {
  id: string;
  tenantId: string;
  experimentKey: string;
  title: string;
  surface: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  allocation?: number;
}
