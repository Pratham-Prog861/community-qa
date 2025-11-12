"use client";

import { useState, useEffect } from "react";
import RouteGuard from "../../../components/RouteGuard";
import EmptyState from "../../../components/EmptyState";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Draft {
  id: string;
  title: string;
  body: string;
  tags: string[];
  lastModified: string;
}

function DraftsContent() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    // Load drafts from localStorage
    const savedDrafts = localStorage.getItem("question_drafts");
    if (savedDrafts) {
      try {
        setDrafts(JSON.parse(savedDrafts));
      } catch (error) {
        console.error("Failed to load drafts:", error);
      }
    }
  }, []);

  const deleteDraft = (id: string) => {
    const updatedDrafts = drafts.filter((d) => d.id !== id);
    setDrafts(updatedDrafts);
    localStorage.setItem("question_drafts", JSON.stringify(updatedDrafts));
  };

  const continueDraft = (draft: Draft) => {
    // Store the draft to be loaded in the ask page
    localStorage.setItem("current_draft", JSON.stringify(draft));
    router.push("/ask");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-4"
        >
          ← Back to Profile
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Drafts</h1>
            <p className="text-sm text-slate-400 mt-2">
              Your saved question drafts - {drafts.length} total
            </p>
          </div>
          <Link
            href="/ask"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition"
          >
            New Question
          </Link>
        </div>
      </div>

      {drafts.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No drafts yet"
          description="Start writing a question and save it as a draft to continue later."
          action={{
            label: "Ask a Question",
            onClick: () => router.push("/ask")
          }}
        />
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-slate-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {draft.title || "Untitled Draft"}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                    {draft.body || "No content yet..."}
                  </p>
                  {draft.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {draft.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-slate-500">
                    Last modified {new Date(draft.lastModified).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => continueDraft(draft)}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition"
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this draft?")) {
                        deleteDraft(draft.id);
                      }
                    }}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:border-red-400/60 hover:text-red-400 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DraftsPage() {
  return (
    <RouteGuard requireAuth>
      <DraftsContent />
    </RouteGuard>
  );
}
