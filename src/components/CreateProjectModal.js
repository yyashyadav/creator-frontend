"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";

export default function CreateProjectModal({ open, onClose, onCreate, loading }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setTitle("");
      setError("");
    }
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await onCreate(title.trim() || "Untitled Project");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create project");
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-bold text-zinc-900">Create new project</h2>
      <p className="mt-2 text-sm text-zinc-500">
        Give your story a name to get started.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="project-title" className="block text-sm font-medium text-zinc-700">
            Project title
          </label>
          <input
            id="project-title"
            type="text"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Comic Story"
            className="mt-1.5 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
