export type UserSummary = {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  reputation?: number;
};

export type Question = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  voteScore: number;
  answersCount: number;
  commentsCount: number;
  viewCount: number;
  isClosed: boolean;
  acceptedAnswer?: string;
  author?: UserSummary;
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string;
};

export type Answer = {
  id: string;
  questionId: string;
  body: string;
  voteScore: number;
  commentsCount: number;
  isAccepted: boolean;
  author?: UserSummary;
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  id: string;
  questionId: string;
  answerId?: string;
  body: string;
  author?: UserSummary;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedResponse<T> = {
  questions: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

export type QuestionDetail = {
  question: Question;
  answers: Answer[];
  comments: Comment[];
};

