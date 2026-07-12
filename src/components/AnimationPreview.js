"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ScenePreviewFrame from "@/components/ScenePreviewFrame";

const FADE_DURATION = 0.4;

function getCharacterOpacity(progress, duration, fadeIn, fadeOut) {
  const time = progress * duration;

  if (fadeIn !== "none" && time < FADE_DURATION) {
    return time / FADE_DURATION;
  }

  if (fadeOut !== "none" && time > duration - FADE_DURATION) {
    return Math.max(0, (duration - time) / FADE_DURATION);
  }

  return 1;
}

function getTypedDialogue(dialogue, progress, duration, textEffect) {
  if (!dialogue) return "";
  if (textEffect === "none") return dialogue;

  const start = FADE_DURATION;
  const end = duration - FADE_DURATION;
  const typingDuration = Math.max(end - start, 0.5);
  const time = progress * duration;

  if (time < start) return "";
  if (time >= end) return dialogue;

  const typingProgress = (time - start) / typingDuration;
  const visibleChars = Math.floor(dialogue.length * typingProgress);
  return dialogue.slice(0, visibleChars);
}

export default function AnimationPreview({ scenes = [] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);

  const frameRef = useRef(null);
  const sceneStartRef = useRef(0);
  const currentIndexRef = useRef(0);
  const scenesRef = useRef(scenes);

  scenesRef.current = scenes;
  currentIndexRef.current = currentIndex;

  const totalDuration = useMemo(
    () => scenes.reduce((sum, scene) => sum + scene.duration, 0),
    [scenes]
  );

  const elapsedBeforeCurrent = useMemo(
    () => scenes.slice(0, currentIndex).reduce((sum, scene) => sum + scene.duration, 0),
    [scenes, currentIndex]
  );

  const overallProgress = useMemo(() => {
    if (totalDuration === 0) return 0;
    return (
      (elapsedBeforeCurrent + sceneProgress * (scenes[currentIndex]?.duration || 0)) /
      totalDuration
    );
  }, [elapsedBeforeCurrent, sceneProgress, scenes, currentIndex, totalDuration]);

  const currentScene = scenes[currentIndex];

  const stopPlayback = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const resetPlayback = useCallback(() => {
    stopPlayback();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentIndex(0);
    setSceneProgress(0);
    currentIndexRef.current = 0;
    sceneStartRef.current = 0;
  }, [stopPlayback]);

  const tick = useCallback(() => {
    const activeScenes = scenesRef.current;
    const index = currentIndexRef.current;
    const scene = activeScenes[index];

    if (!scene) {
      setIsPlaying(false);
      setIsPaused(false);
      stopPlayback();
      return;
    }

    const durationMs = scene.duration * 1000;
    const elapsed = performance.now() - sceneStartRef.current;
    const progress = Math.min(elapsed / durationMs, 1);

    setSceneProgress(progress);

    if (progress >= 1) {
      if (index < activeScenes.length - 1) {
        currentIndexRef.current = index + 1;
        setCurrentIndex(index + 1);
        setSceneProgress(0);
        sceneStartRef.current = performance.now();
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      setIsPlaying(false);
      setIsPaused(false);
      stopPlayback();
      return;
    }

    frameRef.current = requestAnimationFrame(tick);
  }, [stopPlayback]);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      const scene = scenes[currentIndex];
      if (scene) {
        sceneStartRef.current = performance.now() - sceneProgress * scene.duration * 1000;
      }
      frameRef.current = requestAnimationFrame(tick);
    }

    return stopPlayback;
  }, [isPlaying, isPaused, tick, stopPlayback]);

  useEffect(() => {
    resetPlayback();
  }, [scenes, resetPlayback]);

  function handlePlay() {
    if (scenes.length === 0) return;

    if (isPaused) {
      const scene = scenes[currentIndex];
      if (scene) {
        sceneStartRef.current = performance.now() - sceneProgress * scene.duration * 1000;
      }
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    if (!isPlaying) {
      const atEnd = currentIndex === scenes.length - 1 && sceneProgress >= 1;

      if (atEnd || sceneProgress >= 1) {
        currentIndexRef.current = 0;
        setCurrentIndex(0);
        setSceneProgress(0);
        sceneStartRef.current = performance.now();
      } else if (sceneProgress === 0) {
        sceneStartRef.current = performance.now();
      }

      setIsPlaying(true);
      setIsPaused(false);
    }
  }

  function handlePause() {
    if (!isPlaying) return;
    setIsPaused(true);
    setIsPlaying(false);
    stopPlayback();
  }

  function handleReplay() {
    stopPlayback();
    currentIndexRef.current = 0;
    setCurrentIndex(0);
    setSceneProgress(0);
    sceneStartRef.current = performance.now();
    setIsPaused(false);
    setIsPlaying(true);
  }

  const characterOpacity = currentScene
    ? getCharacterOpacity(
        sceneProgress,
        currentScene.duration,
        currentScene.animation?.in || "fadeIn",
        currentScene.animation?.out || "fadeOut"
      )
    : 0;

  const typedDialogue = currentScene
    ? getTypedDialogue(
        currentScene.dialogue,
        sceneProgress,
        currentScene.duration,
        currentScene.animation?.textEffect || "typing"
      )
    : "";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Animation Preview</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Preview how your scenes will play with fade, speech bubble, and typing effects.
          </p>
        </div>

        <div className="flex gap-2">
          {!isPlaying || isPaused ? (
            <button
              type="button"
              onClick={handlePlay}
              disabled={scenes.length === 0}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {isPaused ? "Resume" : "Play"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Pause
            </button>
          )}
          <button
            type="button"
            onClick={handleReplay}
            disabled={scenes.length === 0}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Replay
          </button>
        </div>
      </div>

      <div className="relative mt-6">
        {scenes.length === 0 ? (
          <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-b from-sky-100 to-sky-50 text-sm text-zinc-500 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-400">
            Add scenes to preview your animation
          </div>
        ) : (
          <ScenePreviewFrame
            scene={currentScene}
            opacity={characterOpacity}
            dialogueText={typedDialogue}
            dialoguePosition={currentScene?.dialoguePosition}
            dialogueShape={currentScene?.dialogueShape || "speech"}
            editable={false}
          />
        )}

        {scenes.length > 0 && (
          <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
            Scene {currentIndex + 1} of {scenes.length}
          </div>
        )}
      </div>

      {scenes.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Timeline</span>
            <span>
              {Math.floor(overallProgress * totalDuration)}s / {totalDuration}s
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-violet-600 transition-all duration-100"
              style={{ width: `${overallProgress * 100}%` }}
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {scenes.map((scene, index) => (
              <div
                key={scene.id}
                className={`rounded-lg px-2 py-1 text-xs ${
                  index === currentIndex
                    ? "bg-violet-100 font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
