"use client";

import Link from "next/link";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusBadge({ status }) {
  const styles = {
    draft: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
    rendering: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    completed: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status] || styles.draft}`}
    >
      {status}
    </span>
  );
}

export default function ProjectCard({ project, onRename, onDuplicate, onDelete }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-zinc-900 dark:text-zinc-50">{project.title}</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {project.sceneCount} scene{project.sceneCount !== 1 ? "s" : ""} ·{" "}
            {project.totalDuration}s total
          </p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <p className="mt-3 text-xs text-zinc-400">
        Edited {formatDate(project.lastEditedAt)}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/projects/${project.id}`}
          className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
        >
          Open
        </Link>
        <button
          onClick={() => onRename(project)}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Rename
        </button>
        <button
          onClick={() => onDuplicate(project.id)}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Duplicate
        </button>
        <button
          onClick={() => onDelete(project)}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
