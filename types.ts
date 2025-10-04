
export enum ProcessingStatus {
  IDLE = 'IDLE',
  PARSING = 'PARSING',
  FETCHING = 'FETCHING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export enum ArticleStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface Article {
  id: number;
  name: string;
  url: string;
  status: ArticleStatus;
  content?: string;
  error?: string;
}
