"use client";

import { useParams } from "next/navigation";
import { QuestionDetailView } from "../../../components/QuestionDetailView";

export default function QuestionDetailPage() {
  const params = useParams<{ id: string }>();
  const questionId = params?.id;

  if (!questionId || Array.isArray(questionId)) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-6 text-sm text-red-200">
          Invalid question identifier.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <QuestionDetailView questionId={questionId} />
    </div>
  );
}

