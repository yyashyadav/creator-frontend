"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import SceneEditor from "@/components/SceneEditor";
import { fetchCurrentUser, logoutUser } from "@/lib/auth-api";
import { clearAuth, getToken } from "@/lib/auth";
import { fetchProject } from "@/lib/project-api";

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      const token = getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const [userResult, projectResult] = await Promise.all([
          fetchCurrentUser(token),
          fetchProject(token, projectId),
        ]);

        setUser(userResult.data.user);
        setProject(projectResult.data.project);
        setScenes(projectResult.data.scenes);
      } catch {
        router.replace("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId, router]);

  async function handleLogout() {
    const token = getToken();

    try {
      if (token) {
        await logoutUser(token);
      }
    } catch {
      // Still clear local auth
    } finally {
      clearAuth();
      router.push("/login");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{project?.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              {project?.sceneCount} scene{project?.sceneCount !== 1 ? "s" : ""} ·{" "}
              {project?.totalDuration}s total
            </p>
          </div>
        </div>

        <div className="mt-8">
          <SceneEditor projectId={projectId} initialScenes={scenes} />
        </div>
      </main>
    </div>
  );
}
