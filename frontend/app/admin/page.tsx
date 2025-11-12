"use client";

import { useState, useEffect } from "react";
import RouteGuard from "../../components/RouteGuard";
import EmptyState from "../../components/EmptyState";
import ConfirmDialog from "../../components/ConfirmDialog";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import { useToast } from "../../components/Toast";
import { usePolling } from "../../hooks/usePolling";
import { useAuth } from "../../hooks/useAuth";

function AdminDashboardContent() {
  const { accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState<"flags" | "users" | "logs">("flags");
  const [flags, setFlags] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: "danger" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });
  const { showToast } = useToast();

  const loadData = async () => {
    if (!accessToken) return;
    
    setLoading(true);
    try {
      if (activeTab === "flags") {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/flags?status=pending`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = await res.json();
        setFlags(data.flags || []);
      } else if (activeTab === "users") {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = await res.json();
        setUsers(data.users || []);
      } else if (activeTab === "logs") {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/moderation-logs`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Poll for updates every 30 seconds
  usePolling(loadData, { interval: 30000, enabled: true });

  const handleBanUser = async (userId: string, username: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Ban User",
      message: `Are you sure you want to ban ${username}? They will lose access to the platform.`,
      variant: "danger",
      onConfirm: async () => {
        const reason = prompt("Reason for ban:");
        if (!reason) return;

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/ban`, {
            method: "POST",
            headers: { 
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ reason })
          });

          if (res.ok) {
            showToast("User banned successfully", "success");
            loadData();
          } else {
            showToast("Failed to ban user", "error");
          }
        } catch (error) {
          console.error("Failed to ban user:", error);
          showToast("Failed to ban user", "error");
        } finally {
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        }
      }
    });
  };

  const handleUnbanUser = async (userId: string, username: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Unban User",
      message: `Are you sure you want to unban ${username}? They will regain access to the platform.`,
      variant: "info",
      onConfirm: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/unban`, {
            method: "POST",
            headers: { 
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ reason: "Unbanned by admin" })
          });

          if (res.ok) {
            showToast("User unbanned successfully", "success");
            loadData();
          } else {
            showToast("Failed to unban user", "error");
          }
        } catch (error) {
          console.error("Failed to unban user:", error);
          showToast("Failed to unban user", "error");
        } finally {
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        }
      }
    });
  };

  const handleReviewFlag = async (flagId: string, status: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/flags/${flagId}/review`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        showToast(`Flag ${status} successfully`, "success");
        loadData();
      } else {
        showToast("Failed to review flag", "error");
      }
    } catch (error) {
      console.error("Failed to review flag:", error);
      showToast("Failed to review flag", "error");
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col gap-10 px-4 py-16">
      <header className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-400 md:text-base">
              Manage flags, moderate users, and review moderation logs.
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      <div className="flex gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab("flags")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "flags"
              ? "border-b-2 border-primary text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Flags
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "users"
              ? "border-b-2 border-primary text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "logs"
              ? "border-b-2 border-primary text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Moderation Logs
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={5} />
      ) : (
        <>
          {activeTab === "flags" && (
            <div className="space-y-4">
              {flags.length === 0 ? (
                <EmptyState
                  icon="🚩"
                  title="No pending flags"
                  description="All content has been reviewed. Check back later for new reports."
                />
              ) : (
                flags.map((flag) => (
                  <div key={flag._id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-200">
                            {flag.contentType}
                          </span>
                          <span className="text-sm text-slate-400">
                            Reported by {flag.reporter?.username}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-white">Reason: {flag.reason}</p>
                        {flag.description && (
                          <p className="mt-1 text-sm text-slate-400">{flag.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReviewFlag(flag._id, "resolved")}
                          className="rounded bg-green-500/20 px-3 py-1 text-xs text-green-200 hover:bg-green-500/30"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => handleReviewFlag(flag._id, "dismissed")}
                          className="rounded bg-slate-700 px-3 py-1 text-xs text-slate-200 hover:bg-slate-600"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-4">
              {users.length === 0 ? (
                <EmptyState
                  icon="👥"
                  title="No users found"
                  description="No users match your current filters."
                />
              ) : (
                users.map((user) => (
                <div key={user._id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{user.username}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                      <div className="mt-1 flex gap-2">
                        <span className="text-xs text-slate-400">Role: {user.role}</span>
                        {user.isBanned && (
                          <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-200">
                            Banned
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {user.isBanned ? (
                        <button
                          onClick={() => handleUnbanUser(user._id, user.username)}
                          className="rounded bg-green-500/20 px-3 py-1 text-xs text-green-200 hover:bg-green-500/30"
                        >
                          Unban
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBanUser(user._id, user.username)}
                          className="rounded bg-red-500/20 px-3 py-1 text-xs text-red-200 hover:bg-red-500/30"
                        >
                          Ban
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
          )}

          {activeTab === "logs" && (
            <div className="space-y-4">
              {logs.length === 0 ? (
                <EmptyState
                  icon="📋"
                  title="No moderation logs"
                  description="No moderation actions have been taken yet."
                />
              ) : (
                logs.map((log) => (
                <div key={log._id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{log.action}</p>
                      <p className="text-xs text-slate-400">
                        By {log.moderator?.username} on {new Date(log.createdAt).toLocaleString()}
                      </p>
                      {log.targetUser && (
                        <p className="text-xs text-slate-400">Target: {log.targetUser.username}</p>
                      )}
                      {log.reason && <p className="mt-1 text-xs text-slate-300">Reason: {log.reason}</p>}
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <RouteGuard requireAuth requireAdmin>
      <AdminDashboardContent />
    </RouteGuard>
  );
}

