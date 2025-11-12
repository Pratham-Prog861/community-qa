"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../components/Toast";
import RouteGuard from "../../../components/RouteGuard";
import Link from "next/link";

function SettingsContent() {
  const { user, accessToken, refreshSession } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || ""
  });

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || ""
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessToken) {
      showToast("Please log in to update settings", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        showToast("Settings updated successfully", "success");
        // Refresh user session to get updated data
        await refreshSession();
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to update settings", "error");
      }
    } catch (error) {
      console.error("Failed to update settings:", error);
      showToast("Failed to update settings", "error");
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-3xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-slate-400 mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Profile Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Account Information */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Username</span>
              <span className="text-white">{user?.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Email</span>
              <span className="text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Role</span>
              <span className="text-white capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Member Since</span>
              <span className="text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Preferences</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Email notifications</span>
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary/40"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Show profile publicly</span>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary/40"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <RouteGuard requireAuth>
      <SettingsContent />
    </RouteGuard>
  );
}
