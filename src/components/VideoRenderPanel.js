"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getToken } from "@/lib/auth";
import { cancelRender, getVideo, getVideoStatus, listProjectVideos, retryRender, startRender } from "@/lib/video-api";
import { btnSecondaryClass } from "@/lib/ui-classes";

const POLL_INTERVAL = 2000;

function statusLabel(status) {
  if (status === "queued") return "Queued…";
  if (status === "processing") return "Rendering…";
  if (status === "completed") return "Complete";
  if (status === "failed") return "Failed";
  if (status === "cancelled") return "Cancelled";
  return status;
}

export default function VideoRenderPanel({ projectId, sceneCount = 0 }) {
  const [video, setVideo] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pollRef = useRef(null);

  const loadHistory = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const result = await listProjectVideos(token, projectId);
      setHistory(result.data.videos);

      const active = result.data.videos.find((v) =>
        ["queued", "processing"].includes(v.status)
      );
      const latestFailed = result.data.videos.find((v) => v.status === "failed");
      const latestCompleted = result.data.videos.find((v) => v.status === "completed");

      setVideo((current) => {
        if (current && result.data.videos.some((v) => v.id === current.id)) {
          return current;
        }
        if (active) return active;
        if (latestFailed) return latestFailed;
        if (latestCompleted) return latestCompleted;
        return null;
      });
    } catch {
      // Non-blocking
    }
  }, [projectId]);

  useEffect(() => {
    loadHistory();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [loadHistory]);

  useEffect(() => {
    if (!video || !["queued", "processing"].includes(video.status)) {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return;
    }

    const token = getToken();
    if (!token) return;

    pollRef.current = setInterval(async () => {
      try {
        const statusResult = await getVideoStatus(token, video.id);
        const { status, progress, errorMessage } = statusResult.data;

        if (status === "completed" || status === "failed" || status === "cancelled") {
          const fullResult = await getVideo(token, video.id);
          setVideo(fullResult.data.video);
          loadHistory();
          clearInterval(pollRef.current);
          pollRef.current = null;
          return;
        }

        setVideo((prev) =>
          prev ? { ...prev, status, progress, errorMessage } : prev
        );
      } catch {
        // Keep polling
      }
    }, POLL_INTERVAL);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [video?.id, video?.status, loadHistory]);

  async function handleGenerate() {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const result = await startRender(token, projectId);
      setVideo(result.data.video);
      loadHistory();
    } catch (err) {
      if (err.code === "RENDER_IN_PROGRESS" && err.videoId) {
        const token = getToken();
        if (token) {
          try {
            const fullResult = await getVideo(token, err.videoId);
            setVideo(fullResult.data.video);
            return;
          } catch {
            // fall through
          }
        }
      }
      setError(err.message || "Failed to start render");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    const token = getToken();
    if (!token || !video) return;

    setLoading(true);
    setError("");

    try {
      const result = await cancelRender(token, video.id);
      setVideo(result.data.video);
      loadHistory();
    } catch (err) {
      setError(err.message || "Failed to cancel render");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectVideo(item) {
    if (item.status !== "completed" || !item.fileUrl) return;
    setVideo(item);
    setError("");
  }

  async function handleRetry() {
    const token = getToken();
    if (!token || !video) return;

    setLoading(true);
    setError("");

    try {
      const result = await retryRender(token, video.id);
      setVideo(result.data.video);
      loadHistory();
    } catch (err) {
      setError(err.message || "Failed to retry render");
    } finally {
      setLoading(false);
    }
  }

  const isRendering = video && ["queued", "processing"].includes(video.status);
  const canGenerate =
    sceneCount > 0 && !loading && !isRendering && (!video || ["completed", "failed", "cancelled"].includes(video.status));
  const canCancel = video && ["queued", "processing"].includes(video.status) && !loading;
  const canRetry = video && video.status === "failed" && !loading;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Export Video
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Render a 1080p MP4 from your scenes
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {loading ? "Starting…" : isRendering ? "Rendering…" : "Generate Video"}
        </button>
      </div>

      {sceneCount === 0 && (
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Add at least one scene before generating a video.
        </p>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      {video && (
        <div className="mt-6 rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-200">
              {statusLabel(video.status)}
            </span>
            {video.status === "processing" && (
              <span className="text-zinc-500 dark:text-zinc-400">{video.progress}%</span>
            )}
          </div>

          {["queued", "processing"].includes(video.status) && (
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-violet-600 transition-all duration-300"
                style={{ width: `${video.progress || 0}%` }}
              />
            </div>
          )}

          {canCancel && (
            <button
              type="button"
              onClick={handleCancel}
              className="mt-3 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              Cancel render
            </button>
          )}

          {video.status === "failed" && video.errorMessage && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{video.errorMessage}</p>
          )}

          {video.status === "cancelled" && (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Render was cancelled.</p>
          )}

          {canRetry && (
            <button
              type="button"
              onClick={handleRetry}
              className={`mt-3 ${btnSecondaryClass}`}
            >
              Retry render
            </button>
          )}

          {video.status === "completed" && video.fileUrl && (
            <div className="mt-4 space-y-3">
              <video
                src={video.fileUrl}
                controls
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700"
              />
              <a
                href={video.fileUrl}
                download
                className={`inline-flex ${btnSecondaryClass}`}
              >
                Download MP4
              </a>
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Render history</h3>
          <ul className="mt-2 space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            {history.slice(0, 5).map((item) => (
              <li key={item.id}>
                {item.status === "completed" && item.fileUrl ? (
                  <button
                    type="button"
                    onClick={() => handleSelectVideo(item)}
                    className={`text-left hover:text-violet-600 dark:hover:text-violet-400 ${
                      video?.id === item.id ? "font-medium text-violet-600 dark:text-violet-400" : ""
                    }`}
                  >
                    {new Date(item.createdAt).toLocaleString()} — {statusLabel(item.status)}
                    {video?.id === item.id ? " · Viewing" : " · Click to view"}
                  </button>
                ) : (
                  <span>
                    {new Date(item.createdAt).toLocaleString()} — {statusLabel(item.status)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
