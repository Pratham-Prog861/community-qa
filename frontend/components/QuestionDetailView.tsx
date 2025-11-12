"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import type { Answer, Comment, Question } from "../lib/types";
import {
  createAnswer,
  createAnswerComment,
  createQuestionComment,
  fetchAnswerComments,
  fetchQuestionDetail
} from "../lib/questions";

type AnswerBlockProps = {
  answer: Answer;
  state: {
    loading: boolean;
    expanded: boolean;
    comments: Comment[];
    error?: string;
  };
  onToggle: (answerId: string) => void;
  onSubmitComment: (
    answerId: string,
    body: string,
    setBody: (value: string) => void,
    setSubmitting: (value: boolean) => void
  ) => Promise<void>;
  isAuthenticated: boolean;
  questionId: string;
};

const AnswerBlock = ({
  answer,
  state,
  onToggle,
  onSubmitComment,
  isAuthenticated,
  questionId
}: AnswerBlockProps) => {
  const [commentBody, setCommentBody] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  return (
    <article className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-start justify-between gap-4">
        <p className="whitespace-pre-line text-sm text-slate-200">{answer.body}</p>
        {answer.isAccepted ? (
          <span className="rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
            Accepted
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span>{answer.voteScore} votes</span>
        <span>Posted {new Date(answer.createdAt).toLocaleString()}</span>
        {answer.author ? <span>@{answer.author.username}</span> : null}
      </div>
      <button
        onClick={() => onToggle(answer.id)}
        className="text-xs font-semibold text-primary hover:text-primary/80"
      >
        {state.expanded ? "Hide comments" : `Show comments (${answer.commentsCount})`}
      </button>
      {state.expanded ? (
        <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          {state.error ? (
            <p className="text-xs text-red-300">{state.error}</p>
          ) : null}
          {state.loading ? (
            <p className="text-xs text-slate-500">Loading comments...</p>
          ) : state.comments.length === 0 ? (
            <p className="text-xs text-slate-500">No comments yet.</p>
          ) : (
            <ul className="space-y-2 text-sm text-slate-300">
              {state.comments.map((comment) => (
                <li key={comment.id} className="rounded border border-slate-800 bg-slate-900/70 px-3 py-2">
                  <p className="text-slate-200">{comment.body}</p>
                  <div className="mt-2 flex justify-between text-[11px] uppercase tracking-wide text-slate-500">
                    <span>{comment.author ? `@${comment.author.username}` : "Anonymous"}</span>
                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {isAuthenticated ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void onSubmitComment(answer.id, commentBody, setCommentBody, setSubmittingComment);
              }}
              className="space-y-2"
            >
              <textarea
                value={commentBody}
                onChange={(event) => setCommentBody(event.target.value)}
                rows={2}
                placeholder="Add a comment"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submittingComment ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          ) : (
            <Link
              href={`/login?redirect=/question/${questionId}`}
              className="text-xs text-primary hover:text-primary/80"
            >
              Sign in to comment
            </Link>
          )}
        </div>
      ) : null}
    </article>
  );
};

type QuestionDetailViewProps = {
  questionId: string;
};

type AnswerCommentsState = Record<string, { loading: boolean; comments: Comment[]; error?: string; expanded: boolean }>;

export const QuestionDetailView = ({ questionId }: QuestionDetailViewProps) => {
  const router = useRouter();
  const { isAuthenticated, accessToken } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questionComments, setQuestionComments] = useState<Comment[]>([]);
  const [commentsState, setCommentsState] = useState<AnswerCommentsState>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answerBody, setAnswerBody] = useState("");
  const [answerSubmitting, setAnswerSubmitting] = useState(false);
  const [questionCommentBody, setQuestionCommentBody] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const detail = await fetchQuestionDetail(questionId);
        if (!ignore) {
          setQuestion(detail.question);
          setAnswers(detail.answers);
          setQuestionComments(detail.comments);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Unable to load question");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    void load();
    return () => {
      ignore = true;
    };
  }, [questionId]);

  const handleAnswerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) {
      router.push(`/login?redirect=/question/${questionId}`);
      return;
    }
    if (!answerBody.trim()) return;
    setAnswerSubmitting(true);
    try {
      const { answer } = await createAnswer(questionId, { body: answerBody }, accessToken);
      setAnswers((prev) => [answer, ...prev]);
      setQuestion((prev) =>
        prev
          ? {
              ...prev,
              answersCount: prev.answersCount + 1,
              lastActivityAt: new Date().toISOString()
            }
          : prev
      );
      setAnswerBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit answer");
    } finally {
      setAnswerSubmitting(false);
    }
  };

  const handleQuestionCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) {
      router.push(`/login?redirect=/question/${questionId}`);
      return;
    }
    if (!questionCommentBody.trim()) return;
    setCommentSubmitting(true);
    try {
      const { comment } = await createQuestionComment(
        questionId,
        { body: questionCommentBody },
        accessToken
      );
      setQuestionComments((prev) => [...prev, comment]);
      setQuestion((prev) =>
        prev
          ? {
              ...prev,
              commentsCount: prev.commentsCount + 1,
              lastActivityAt: new Date().toISOString()
            }
          : prev
      );
      setQuestionCommentBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit comment");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const toggleAnswerComments = async (answerId: string) => {
    setCommentsState((prev) => ({
      ...prev,
      [answerId]: {
        comments: prev[answerId]?.comments ?? [],
        loading: !prev[answerId]?.expanded,
        expanded: !prev[answerId]?.expanded,
        error: prev[answerId]?.expanded ? prev[answerId]?.error : undefined
      }
    }));

    if (commentsState[answerId]?.expanded) {
      return;
    }

    try {
      const { comments } = await fetchAnswerComments(questionId, answerId);
      setCommentsState((prev) => ({
        ...prev,
        [answerId]: { comments, loading: false, expanded: true }
      }));
    } catch (err) {
      setCommentsState((prev) => ({
        ...prev,
        [answerId]: {
          comments: prev[answerId]?.comments ?? [],
          loading: false,
          expanded: true,
          error: err instanceof Error ? err.message : "Unable to load comments"
        }
      }));
    }
  };

  const handleAnswerCommentSubmit = async (
    answerId: string,
    body: string,
    setBody: (value: string) => void,
    setSubmitting: (value: boolean) => void
  ) => {
    if (!accessToken) {
      router.push(`/login?redirect=/question/${questionId}`);
      return;
    }
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      const { comment } = await createAnswerComment(questionId, answerId, { body }, accessToken);
      setCommentsState((prev) => {
        const current = prev[answerId] ?? { comments: [], loading: false, expanded: true };
        return {
          ...prev,
          [answerId]: {
            ...current,
            comments: [...(current.comments ?? []), comment],
            expanded: true,
            loading: false,
            error: undefined
          }
        };
      });
      setAnswers((prev) =>
        prev.map((answerItem) =>
          answerItem.id === answerId
            ? {
                ...answerItem,
                commentsCount: answerItem.commentsCount + 1
              }
            : answerItem
        )
      );
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit comment");
    } finally {
      setSubmitting(false);
    }
  };

  const orderedAnswers = useMemo(
    () =>
      answers.slice().sort((a, b) => {
        if (a.isAccepted && !b.isAccepted) return -1;
        if (!a.isAccepted && b.isAccepted) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }),
    [answers]
  );

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-sm text-slate-300">
        Loading question...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-8 text-sm text-red-200">
        {error}
      </div>
    );
  }

  if (!question) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-sm text-slate-300">
        Question not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <article className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-soft backdrop-blur">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-white">{question.title}</h1>
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
                {tag}
              </span>
            ))}
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-200">{question.body}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span>{question.viewCount} views</span>
          <span>{question.answersCount} answers</span>
          <span>{question.voteScore} votes</span>
          {question.author ? (
            <span className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-1">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] uppercase text-primary">
                {question.author.name.slice(0, 1)}
              </span>
              Asked by @{question.author.username}
            </span>
          ) : null}
          <span>Created {new Date(question.createdAt).toLocaleString()}</span>
        </div>

        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <header className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Comments</h3>
            {isAuthenticated ? null : (
              <Link href={`/login?redirect=/question/${questionId}`} className="text-xs text-primary hover:text-primary/80">
                Sign in to comment
              </Link>
            )}
          </header>
          <ul className="space-y-3 text-sm text-slate-300">
            {questionComments.length === 0 ? (
              <li className="text-xs text-slate-500">No comments yet. Start the discussion!</li>
            ) : (
              questionComments.map((comment) => (
                <li key={comment.id} className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
                  <p className="text-slate-200">{comment.body}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-wide text-slate-500">
                    <span>{comment.author ? `@${comment.author.username}` : "Anonymous"}</span>
                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                </li>
              ))
            )}
          </ul>
          {isAuthenticated ? (
            <form onSubmit={handleQuestionCommentSubmit} className="space-y-3">
              <textarea
                value={questionCommentBody}
                onChange={(event) => setQuestionCommentBody(event.target.value)}
                rows={3}
                placeholder="Add a comment"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={commentSubmitting}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {commentSubmitting ? "Posting..." : "Post comment"}
                </button>
              </div>
            </form>
          ) : null}
        </section>
      </article>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-soft">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Answers ({answers.length})</h2>
          {isAuthenticated ? null : (
            <Link
              href={`/login?redirect=/question/${questionId}`}
              className="text-xs font-semibold text-primary hover:text-primary/80"
            >
              Sign in to answer
            </Link>
          )}
        </header>
        {orderedAnswers.length === 0 ? (
          <p className="text-sm text-slate-400">No answers yet. Be the first to share your expertise.</p>
        ) : (
          <div className="space-y-4">
            {orderedAnswers.map((answer) => {
              const commentState = commentsState[answer.id] ?? {
                comments: [],
                loading: false,
                expanded: false
              };
              return (
                <AnswerBlock
                  key={answer.id}
                  answer={answer}
                  state={commentState}
                  onToggle={(id) => void toggleAnswerComments(id)}
                  onSubmitComment={handleAnswerCommentSubmit}
                  isAuthenticated={isAuthenticated}
                  questionId={questionId}
                />
              );
            })}
          </div>
        )}
      </section>

      {isAuthenticated ? (
        <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-white">Your answer</h2>
          <form onSubmit={handleAnswerSubmit} className="space-y-4">
            <textarea
              value={answerBody}
              onChange={(event) => setAnswerBody(event.target.value)}
              rows={6}
              placeholder="Share your solution, include code snippets, and explain why it works."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={answerSubmitting}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {answerSubmitting ? "Posting..." : "Post answer"}
              </button>
            </div>
          </form>
        </section>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-300">
          <Link href={`/login?redirect=/question/${questionId}`} className="text-primary hover:text-primary/80">
            Sign in
          </Link>{" "}
          to contribute an answer.
        </div>
      )}
    </div>
  );
};

