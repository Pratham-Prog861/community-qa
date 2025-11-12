"use client";

import { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import { QuestionCard } from "./QuestionCard";
import type { Question } from "../lib/types";
import { fetchQuestions, type QuestionQuery } from "../lib/questions";

const SORT_OPTIONS: Array<{ value: QuestionQuery["sort"]; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "activity", label: "Active" },
  { value: "votes", label: "Votes" },
  { value: "views", label: "Views" },
  { value: "oldest", label: "Oldest" }
];

export const QuestionFeed = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState("");
  const [sort, setSort] = useState<QuestionQuery["sort"]>("newest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo<QuestionQuery>(
    () => ({
      page,
      limit: 10,
      search: search.trim() || undefined,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      sort
    }),
    [page, search, tags, sort]
  );

  useEffect(() => {
    let ignore = false;
    const loadQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchQuestions(query);
        if (!ignore) {
          setQuestions(data.questions);
          setPages(data.pagination.pages || 1);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Unable to load questions");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    void loadQuestions();

    return () => {
      ignore = true;
    };
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [search, tags, sort]);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-12">
      <header className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-soft backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Latest questions</h2>
          <p className="text-sm text-slate-400">Filter by topic, search, and sort to find the best threads.</p>
        </div>
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search questions..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="Tags (comma separated)"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40 md:w-56"
          />
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as QuestionQuery["sort"])}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40 md:w-40"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value ?? "newest"}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {error ? (
        <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-6 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {loading && questions.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-300">
          Loading questions...
        </div>
      ) : null}

      {!loading && questions.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-300">
          No questions found. Try adjusting your search or tag filters.
        </div>
      ) : null}

      <div className="grid gap-4">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>

      {pages > 1 ? (
        <nav className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300">
          <button
            className={clsx(
              "rounded-lg px-4 py-2 transition",
              page > 1 ? "border border-slate-700 hover:border-primary/60 hover:text-white" : "opacity-40"
            )}
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button
            className={clsx(
              "rounded-lg px-4 py-2 transition",
              page < pages ? "border border-slate-700 hover:border-primary/60 hover:text-white" : "opacity-40"
            )}
            disabled={page >= pages}
            onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
          >
            Next
          </button>
        </nav>
      ) : null}
    </section>
  );
};

