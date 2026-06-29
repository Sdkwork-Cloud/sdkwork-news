export interface NewsReportCommand {
  targetType: 'item' | 'comment' | 'media' | 'source';
  targetId: string;
  reason: string;
}
