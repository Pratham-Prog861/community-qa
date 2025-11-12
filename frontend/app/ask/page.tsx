"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { createQuestion } from "../../lib/questions";
import RouteGuard from "../../components/RouteGuard";
import { useToast } from "../../components/Toast";

const guidelines = [
  "Summarize your problem in a single, descriptive title.",
  "Provide full context—what you tried, expected, and observed.",
  "Attach code snippets, error messages, or screenshots when relevant.",
  "Tag your question so the right experts can find it quickly."
];

function AskQuestionContent() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) {
      showToast("Please sign in to ask a question", "error");
      router.push("/login?redirect=/ask");
      return;
    }
    if (!title.trim() || !details.trim()) {
      showToast("Title and details are required", "warning");
      return;
    }
    setSubmitting(true);
    try {
      const tagsArray = tags
        .split(/[,\s]+/)
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 8);
      const { question } = await createQuestion(
        { title, body: details, tags: tagsArray },
        accessToken
      );
      setTitle("");
      setDetails("");
      setTags("");
      showToast("Question published successfully!", "success");
      router.push(`/question/${question.id}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to publish question", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col gap-8 px-4 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-white">Ask a question</h1>
          <p className="max-w-2xl text-sm text-slate-400 md:text-base">
            Get detailed answers from the community. The more precise your question, the faster you&apos;ll receive a helpful solution.
          </p>
        </div>
        <Link
          href="/guidelines"
          className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
        >
          Question guidelines
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-soft backdrop-blur">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-slate-200">
              Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. How can I optimize MongoDB queries with dynamic filters?"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="details" className="text-sm font-medium text-slate-200">
              Details
            </label>
            <textarea
              id="details"
              required
              rows={6}
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder="Share what you’ve tried, the behavior you expected, and the exact result."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium text-slate-200">
              Tags
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="nextjs mongodb performance"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
            <p className="text-xs text-slate-500">Add up to 8 tags separated by spaces or commas.</p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Publishing..." : "Publish question"}
          </button>
        </form>

        <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-soft">
          <h2 className="text-base font-semibold text-white">Writing a great question</h2>
          <ul className="space-y-3 text-sm text-slate-300">
            {guidelines.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-primary/40 text-xs text-primary">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400">
            Reviewing before you post helps moderators approve answers faster and keeps the knowledge base clean.
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function AskQuestionPage() {
  return (
    <RouteGuard requireAuth redirectTo="/login?redirect=/ask">
      <AskQuestionContent />
    </RouteGuard>
  );
}

