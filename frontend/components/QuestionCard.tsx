"use client";

import Link from "next/link";
import type { Question } from "../lib/types";

type QuestionCardProps = {
  question: Question;
};

export const QuestionCard = ({ question }: QuestionCardProps) => {
  const createdAt = new Date(question.createdAt);
  const activityAt = question.lastActivityAt ? new Date(question.lastActivityAt) : createdAt;
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-soft backdrop-blur transition hover:border-primary/40">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Link href={`/question/${question.id}`} className="text-lg font-semibold leading-tight text-white hover:text-primary">
            {question.title}
          </Link>
          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
            {question.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-right text-xs text-slate-500">
          <span>{question.viewCount} views</span>
          <span>{question.answersCount} answers</span>
          <span>{question.voteScore} votes</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
        {question.author ? (
          <span className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] uppercase text-primary">
              {question.author.name.slice(0, 1)}
            </span>
            @{question.author.username}
          </span>
        ) : null}
        <span>asked {createdAt.toLocaleDateString()}</span>
        <span className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1 text-[11px] uppercase tracking-wide">
          active {activityAt.toLocaleDateString()}
        </span>
      </div>
    </article>
  );
};

