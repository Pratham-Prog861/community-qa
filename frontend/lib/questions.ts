import { apiFetch } from "./api";
import type { Answer, Comment, PaginatedResponse, Question, QuestionDetail } from "./types";

export type QuestionQuery = {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
  sort?: "newest" | "oldest" | "votes" | "views" | "activity";
};

function buildQuery(params: Record<string, string | number | undefined>) {
  const url = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.append(key, String(value));
    }
  });
  const qs = url.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchQuestions(query: QuestionQuery = {}) {
  const qs = buildQuery({
    page: query.page,
    limit: query.limit,
    search: query.search,
    tags: query.tags?.join(","),
    sort: query.sort
  });
  return apiFetch<PaginatedResponse<Question>>(`/questions${qs}`);
}

export async function fetchQuestionDetail(questionId: string) {
  return apiFetch<QuestionDetail>(`/questions/${questionId}`);
}

export async function createQuestion(
  input: { title: string; body: string; tags?: string[] },
  token: string
) {
  return apiFetch<{ question: Question }>(`/questions`, {
    method: "POST",
    body: JSON.stringify(input),
    token
  });
}

export async function createAnswer(
  questionId: string,
  input: { body: string },
  token: string
) {
  return apiFetch<{ answer: Answer }>(`/questions/${questionId}/answers`, {
    method: "POST",
    body: JSON.stringify(input),
    token
  });
}

export async function createQuestionComment(
  questionId: string,
  input: { body: string },
  token: string
) {
  return apiFetch<{ comment: Comment }>(`/questions/${questionId}/comments`, {
    method: "POST",
    body: JSON.stringify(input),
    token
  });
}

export async function createAnswerComment(
  questionId: string,
  answerId: string,
  input: { body: string },
  token: string
) {
  return apiFetch<{ comment: Comment }>(
    `/questions/${questionId}/answers/${answerId}/comments`,
    {
      method: "POST",
      body: JSON.stringify(input),
      token
    }
  );
}

export async function fetchAnswerComments(questionId: string, answerId: string) {
  return apiFetch<{ comments: Comment[] }>(
    `/questions/${questionId}/answers/${answerId}/comments`
  );
}

