"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QuestionCard } from "./QuestionCard";
import type { Question } from "../lib/types";
import { fetchQuestions } from "../lib/questions";

export const FeaturedQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const data = await fetchQuestions({ limit: 4, sort: "activity" });
        if (!ignore) setQuestions(data.questions);
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : "Unable to load questions");
      }
    };
    void load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="border-b border-slate-900 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">Trending questions</h2>
            <p className="text-sm text-slate-400">
              High-signal discussions from builders and engineers this week.
            </p>
          </div>
          <Link
            href="/questions"
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
          >
            View all questions
          </Link>
        </header>

        {error ? (
          <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {questions.length === 0 && !error ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-300">
              No featured questions yet.
            </div>
          ) : (
            questions.map((question) => <QuestionCard key={question.id} question={question} />)
          )}
        </div>
      </div>
    </section>
  );
};

