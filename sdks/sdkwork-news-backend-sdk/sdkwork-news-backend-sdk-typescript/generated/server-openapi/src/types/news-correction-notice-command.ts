export interface NewsCorrectionNoticeCommand {
  itemId: string;
  correctionType: 'correction' | 'clarification' | 'retraction' | 'update';
  title: string;
  body: string;
  actorUserId?: string;
}
