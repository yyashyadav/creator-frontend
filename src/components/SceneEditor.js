"use client";

import { useEffect, useMemo, useState } from "react";
import AnimationPreview from "@/components/AnimationPreview";
import DeleteSceneModal from "@/components/DeleteSceneModal";
import { DIALOGUE_SHAPES, ShapePreview } from "@/components/DialogueBubble";
import ScenePreviewFrame from "@/components/ScenePreviewFrame";
import { getToken } from "@/lib/auth";
import { inputClass, labelClass, btnSecondaryClass } from "@/lib/ui-classes";
import {
  createScene,
  deleteScene,
  reorderScene,
  updateScene,
  uploadSceneImage,
} from "@/lib/scene-api";

export default function SceneEditor({ projectId, initialScenes = [] }) {
  const [scenes, setScenes] = useState(initialScenes);
  const [selectedId, setSelectedId] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [dialogue, setDialogue] = useState("");
  const [duration, setDuration] = useState(2);
  const [dialoguePosition, setDialoguePosition] = useState({ x: 50, y: 18 });
  const [dialogueShape, setDialogueShape] = useState("speech");
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sceneToDelete, setSceneToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const selectedScene = scenes.find((scene) => scene.id === selectedId);
  const selectedIndex = scenes.findIndex((scene) => scene.id === selectedId);

  const previewScenes = useMemo(
    () =>
      scenes.map((scene) =>
        scene.id === selectedId
          ? { ...scene, dialogue, duration, dialoguePosition, dialogueShape }
          : scene
      ),
    [scenes, selectedId, dialogue, duration, dialoguePosition, dialogueShape]
  );

  function openEditor(sceneId) {
    setSelectedId(sceneId);
    setIsEditorOpen(true);
    setError("");
  }

  function closeEditor() {
    setIsEditorOpen(false);
  }

  useEffect(() => {
    if (selectedScene && isEditorOpen) {
      setDialogue(selectedScene.dialogue || "");
      setDuration(selectedScene.duration || 2);
      setDialoguePosition(selectedScene.dialoguePosition || { x: 50, y: 18 });
      setDialogueShape(selectedScene.dialogueShape || "speech");
    }
  }, [selectedScene, isEditorOpen]);

  useEffect(() => {
    if (!savedMessage) return;
    const timer = setTimeout(() => setSavedMessage(""), 2500);
    return () => clearTimeout(timer);
  }, [savedMessage]);

  async function handleAddScene() {
    const token = getToken();
    if (!token) return;

    setError("");

    try {
      const result = await createScene(token, projectId);
      const newScene = result.data.scene;
      setScenes((prev) => [...prev, newScene]);
      openEditor(newScene.id);
    } catch (err) {
      setError(err.message || "Failed to add scene");
    }
  }

  async function handleSaveScene() {
    const token = getToken();
    if (!token || !selectedId) return;

    setSaving(true);
    setError("");
    setSavedMessage("");

    try {
      const result = await updateScene(token, selectedId, {
        dialogue,
        duration,
        dialoguePosition,
        dialogueShape,
      });
      setScenes((prev) =>
        prev.map((scene) => (scene.id === selectedId ? result.data.scene : scene))
      );
      setSavedMessage(`Scene ${selectedIndex + 1} saved successfully`);
      closeEditor();
    } catch (err) {
      setError(err.message || "Failed to save scene");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e) {
    const token = getToken();
    const file = e.target.files?.[0];
    if (!token || !selectedId || !file) return;

    setUploading(true);
    setError("");

    try {
      const result = await uploadSceneImage(token, selectedId, file);
      setScenes((prev) =>
        prev.map((scene) => (scene.id === selectedId ? result.data.scene : scene))
      );
    } catch (err) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleReorder(sceneId, direction) {
    const token = getToken();
    if (!token) return;

    setError("");

    try {
      const result = await reorderScene(token, sceneId, direction);
      setScenes(result.data.scenes);
    } catch (err) {
      setError(err.message || "Failed to reorder scene");
    }
  }

  async function handleConfirmDelete() {
    const token = getToken();
    if (!token || !sceneToDelete) return;

    setDeleting(true);
    setError("");

    try {
      await deleteScene(token, sceneToDelete.id);
      const remaining = scenes.filter((scene) => scene.id !== sceneToDelete.id);
      setScenes(remaining);

      if (selectedId === sceneToDelete.id) {
        setSelectedId(null);
        setIsEditorOpen(false);
      }

      setSceneToDelete(null);
    } catch (err) {
      setError(err.message || "Failed to delete scene");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      {savedMessage && (
        <div className="fixed right-6 top-6 z-50 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 shadow-lg dark:border-green-800 dark:bg-green-950/50 dark:text-green-300">
          {savedMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      <div className={`grid gap-6 ${isEditorOpen ? "lg:grid-cols-12" : ""}`}>
        <div className={isEditorOpen ? "lg:col-span-4" : ""}>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Scenes</h2>
              <button
                type="button"
                onClick={handleAddScene}
                className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
              >
                + Add Scene
              </button>
            </div>

            {scenes.length === 0 ? (
              <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No scenes yet. Add your first scene.
              </p>
            ) : (
              <div
                className={`mt-4 gap-3 ${
                  isEditorOpen ? "space-y-3" : "grid sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {scenes.map((scene, index) => (
                  <div
                    key={scene.id}
                    className={`rounded-xl border p-3 transition-colors ${
                      selectedId === scene.id && isEditorOpen
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-950/40"
                        : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        {scene.characterImageUrl ? (
                          <img
                            src={scene.characterImageUrl}
                            alt={`Scene ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-zinc-400">{index + 1}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          Scene {index + 1}
                        </p>
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                          {scene.dialogue || "No dialogue"} · {scene.duration}s
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEditor(scene.id)}
                        className="rounded-lg bg-violet-600 px-3 py-1 text-xs font-semibold text-white hover:bg-violet-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleReorder(scene.id, "up")}
                        className="rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={index === scenes.length - 1}
                        onClick={() => handleReorder(scene.id, "down")}
                        className="rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSceneToDelete({ id: scene.id, number: index + 1 })
                        }
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {isEditorOpen && selectedScene && (
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-violet-200 bg-white p-6 shadow-sm dark:border-violet-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Edit Scene {selectedIndex + 1}
                </h2>
                <button
                  type="button"
                  onClick={closeEditor}
                  className={btnSecondaryClass}
                >
                  Close
                </button>
              </div>

              <div className="mt-6">
                <label className={labelClass}>
                  Character image
                </label>
                <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800">
                    {selectedScene.characterImageUrl ? (
                      <img
                        src={selectedScene.characterImageUrl}
                        alt="Character"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-zinc-400">No image</span>
                    )}
                  </div>
                  <div>
                    <label className={`inline-flex cursor-pointer ${btnSecondaryClass}`}>
                      {uploading ? "Uploading..." : "Upload image"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <p className="mt-2 text-xs text-zinc-400">
                      PNG, JPG, WEBP or GIF · Max 5MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="dialogue" className={labelClass}>
                  Dialogue
                </label>
                <textarea
                  id="dialogue"
                  rows={3}
                  value={dialogue}
                  onChange={(e) => setDialogue(e.target.value)}
                  placeholder="What does the character say?"
                  className={inputClass}
                />
              </div>

              <div className="mt-6">
                <label className={labelClass}>
                  Dialogue shape
                </label>
                <p className="mt-1 text-xs text-zinc-400">
                  Pick a comic bubble style for this scene.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {DIALOGUE_SHAPES.map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => setDialogueShape(shape.id)}
                      className="text-left"
                    >
                      <ShapePreview
                        shape={shape.id}
                        selected={dialogueShape === shape.id}
                      />
                      <p className="mt-1.5 text-center text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        {shape.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className={labelClass}>
                  Dialogue position
                </label>
                <p className="mt-1 text-xs text-zinc-400">
                  Drag the bubble onto the character where you want it.
                </p>
                <div className="mt-2">
                  <ScenePreviewFrame
                    scene={selectedScene}
                    dialogueText={dialogue || "Drag me"}
                    dialoguePosition={dialoguePosition}
                    dialogueShape={dialogueShape}
                    editable
                    onPositionChange={setDialoguePosition}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="duration" className={labelClass}>
                  Duration (seconds)
                </label>
                <input
                  id="duration"
                  type="number"
                  min={1}
                  max={60}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className={`${inputClass} w-32`}
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleSaveScene}
                  disabled={saving}
                  className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save & close"}
                </button>
                <button
                  type="button"
                  onClick={closeEditor}
                  className={btnSecondaryClass}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <AnimationPreview scenes={previewScenes} />
      </div>

      <DeleteSceneModal
        open={Boolean(sceneToDelete)}
        sceneNumber={sceneToDelete?.number}
        onClose={() => setSceneToDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
