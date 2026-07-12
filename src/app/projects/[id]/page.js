"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { fetchCurrentUser, logoutUser } from "@/lib/auth-api";
import { clearAuth, getToken } from "@/lib/auth";
import { fetchProject } from "@/lib/project-api";

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
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
        <p className="text-sm text-zinc-500">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-violet-600 hover:underline"
        >
          ← Back to dashboard
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-zinc-900">{project?.title}</h1>
        <p className="mt-2 text-zinc-500">
          Scene editor coming in Step 6. This project has {project?.sceneCount}{" "}
          scene{project?.sceneCount !== 1 ? "s" : ""}.
        </p>

        <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <p className="text-sm text-zinc-500">Scene editor will be built here</p>
        </div>
      </main>
    </div>
  );
}
