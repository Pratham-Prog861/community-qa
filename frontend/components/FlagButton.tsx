"use client";

import { useState } from "react";
import { useToast } from "./Toast";
import { useAuth } from "../hooks/useAuth";

interface FlagButtonProps {
  contentType: "question" | "answer" | "comment";
  contentId: string;
}

export default function FlagButton({ contentType, contentId }: FlagButtonProps) {
  const { accessToken } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessToken) {
      showToast("Please log in to flag content", "error");
      return;
    }
    
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/flags`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ contentType, contentId, reason, description })
      });

      if (res.ok) {
        showToast("Content flagged successfully. Admins will review it soon.", "success");
        setShowModal(false);
        setReason("");
        setDescription("");
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to flag content", "error");
      }
    } catch (error) {
      console.error("Failed to flag content:", error);
      showToast("Failed to flag content. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-xs text-slate-400 hover:text-red-400 transition"
      >
        Flag
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Flag Content</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
                >
                  <option value="">Select a reason</option>
                  <option value="spam">Spam</option>
                  <option value="offensive">Offensive</option>
                  <option value="low-quality">Low Quality</option>
                  <option value="duplicate">Duplicate</option>
                  <option value="off-topic">Off Topic</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
                  placeholder="Provide additional details..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Flag"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
