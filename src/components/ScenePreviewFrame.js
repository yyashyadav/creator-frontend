"use client";

import { useCallback, useRef } from "react";
import DialogueBubble from "@/components/DialogueBubble";

function positionClass(position) {
  if (position === "left") return "justify-start pl-2 sm:pl-6";
  if (position === "right") return "justify-end pr-2 sm:pr-6";
  return "justify-center";
}

export default function ScenePreviewFrame({
  scene,
  opacity = 1,
  dialogueText = "",
  dialoguePosition = { x: 50, y: 18 },
  dialogueShape = "speech",
  editable = false,
  onPositionChange,
}) {
  const frameRef = useRef(null);
  const draggingRef = useRef(false);

  const updatePosition = useCallback(
    (clientX, clientY) => {
      if (!frameRef.current || !onPositionChange) return;

      const rect = frameRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;

      onPositionChange({
        x: Math.min(95, Math.max(5, x)),
        y: Math.min(92, Math.max(6, y)),
      });
    },
    [onPositionChange]
  );

  function handlePointerDown(e) {
    if (!editable) return;
    draggingRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updatePosition(e.clientX, e.clientY);
  }

  function handlePointerMove(e) {
    if (!draggingRef.current) return;
    updatePosition(e.clientX, e.clientY);
  }

  function handlePointerUp(e) {
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  }

  return (
    <div
      ref={frameRef}
      className="relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-b from-sky-100 to-sky-50 dark:from-zinc-800 dark:to-zinc-900"
    >
      <div className={`absolute inset-0 flex ${positionClass(scene?.position)}`}>
        {scene?.characterImageUrl ? (
          <img
            src={scene.characterImageUrl}
            alt="Character"
            className="h-full max-w-full select-none object-contain"
            style={{ opacity }}
            draggable={false}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-sm text-zinc-400"
            style={{ opacity }}
          >
            No image
          </div>
        )}
      </div>

      {dialogueText && (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            left: `${dialoguePosition.x}%`,
            top: `${dialoguePosition.y}%`,
            transform: "translate(-50%, -50%)",
            opacity,
          }}
          className="absolute"
        >
          <DialogueBubble
            text={dialogueText}
            shape={dialogueShape}
            editable={editable}
          />
        </div>
      )}
    </div>
  );
}
