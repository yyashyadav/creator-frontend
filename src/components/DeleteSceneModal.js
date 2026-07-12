"use client";

import Modal from "@/components/Modal";
import { btnSecondaryClass } from "@/lib/ui-classes";

export default function DeleteSceneModal({
  open,
  sceneNumber,
  onClose,
  onConfirm,
  loading,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-5 w-5 text-red-600"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </div>

      <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">Delete scene?</h2>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Are you sure you want to delete{" "}
        <span className="font-medium text-zinc-700 dark:text-zinc-200">Scene {sceneNumber}</span>?
        This action cannot be undone.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className={`${btnSecondaryClass} disabled:opacity-60`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {loading ? "Deleting..." : "Delete scene"}
        </button>
      </div>
    </Modal>
  );
}
