"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreateProjectModal from "@/components/CreateProjectModal";
import DashboardHeader from "@/components/DashboardHeader";
import DeleteProjectModal from "@/components/DeleteProjectModal";
import ProjectCard from "@/components/ProjectCard";
import { fetchCurrentUser, logoutUser } from "@/lib/auth-api";
import { clearAuth, getToken, getUser } from "@/lib/auth";
import {
  createProject,
  deleteProject,
  duplicateProject,
  fetchProjects,
  updateProject,
} from "@/lib/project-api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  async function loadDashboard() {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const cachedUser = getUser();
    if (cachedUser) {
      setUser(cachedUser);
    }

    try {
      const [userResult, projectsResult] = await Promise.all([
        fetchCurrentUser(token),
        fetchProjects(token),
      ]);

      setUser(userResult.data.user);
      setProjects(projectsResult.data.projects);
    } catch {
      clearAuth();
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [router]);

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

  async function handleCreateProject(title) {
    const token = getToken();
    if (!token) return;

    setCreating(true);
    setError("");

    try {
      const result = await createProject(token, { title });
      setProjects((prev) => [result.data.project, ...prev]);
    } catch (err) {
      setError(err.message || "Failed to create project");
      throw err;
    } finally {
      setCreating(false);
    }
  }

  async function handleRename(project) {
    const token = getToken();
    if (!token) return;

    const newName = window.prompt("Rename project", project.title);
    if (!newName?.trim() || newName.trim() === project.title) return;

    try {
      const result = await updateProject(token, project.id, {
        title: newName.trim(),
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? result.data.project : p))
      );
    } catch (err) {
      setError(err.message || "Failed to rename project");
    }
  }

  async function handleDuplicate(projectId) {
    const token = getToken();
    if (!token) return;

    try {
      const result = await duplicateProject(token, projectId);
      setProjects((prev) => [result.data.project, ...prev]);
    } catch (err) {
      setError(err.message || "Failed to duplicate project");
    }
  }

  async function handleConfirmDelete() {
    const token = getToken();
    if (!token || !projectToDelete) return;

    setDeleting(true);
    setError("");

    try {
      await deleteProject(token, projectToDelete.id);
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setProjectToDelete(null);
    } catch (err) {
      setError(err.message || "Failed to delete project");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Welcome, {user?.name}
            </h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">Manage your story projects</p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
          >
            + New Project
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}

        {projects.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-600 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No projects yet</p>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              Create your first project to get started
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="mt-4 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
            >
              + New Project
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onRename={handleRename}
                onDuplicate={handleDuplicate}
                onDelete={setProjectToDelete}
              />
            ))}
          </div>
        )}
      </main>

      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateProject}
        loading={creating}
      />

      <DeleteProjectModal
        open={Boolean(projectToDelete)}
        project={projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
