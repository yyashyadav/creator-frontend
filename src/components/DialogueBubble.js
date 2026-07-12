export const DIALOGUE_SHAPES = [
  { id: "speech", label: "Speech", desc: "Classic comic bubble" },
  { id: "thought", label: "Thought", desc: "Cloud thought bubble" },
  { id: "shout", label: "Shout", desc: "Bold burst bubble" },
  { id: "caption", label: "Caption", desc: "Narration box" },
  { id: "whisper", label: "Whisper", desc: "Soft dashed bubble" },
  { id: "radio", label: "Radio", desc: "Electronic transmission" },
  { id: "faint", label: "Faint", desc: "Weak, trailing-off voice" },
  { id: "megaphone", label: "Announce", desc: "Flared megaphone banner" },
];

// Reusable clip-path shapes, kept in one place so preview + real bubble stay in sync
const CLIPS = {
  shout:
    "polygon(3% 2%, 97% 0%, 100% 20%, 96% 40%, 100% 60%, 97% 80%, 100% 98%, 50% 100%, 0% 98%, 3% 80%, 0% 60%, 4% 40%, 0% 20%)",
  shoutPreview:
    "polygon(8% 0%, 92% 0%, 100% 25%, 95% 50%, 100% 75%, 92% 100%, 8% 100%, 0% 75%, 5% 50%, 0% 25%)",
  radio:
    "polygon(0% 15%, 12.5% 0%, 25% 15%, 37.5% 0%, 50% 15%, 62.5% 0%, 75% 15%, 87.5% 0%, 100% 15%, 100% 85%, 87.5% 100%, 75% 85%, 62.5% 100%, 50% 85%, 37.5% 100%, 25% 85%, 12.5% 100%, 0% 85%)",
  megaphone: "polygon(0% 22%, 84% 0%, 100% 18%, 100% 82%, 84% 100%, 0% 78%)",
};

function Tail({ shape }) {
  if (shape === "caption" || shape === "whisper" || shape === "radio" || shape === "megaphone")
    return null;

  if (shape === "thought") {
    return (
      <div className="absolute -bottom-5 left-6 flex gap-1">
        <span className="h-2.5 w-2.5 rounded-full border border-zinc-200 bg-white shadow-sm" />
        <span className="mt-1 h-2 w-2 rounded-full border border-zinc-200 bg-white shadow-sm" />
        <span className="mt-2 h-1.5 w-1.5 rounded-full border border-zinc-200 bg-white shadow-sm" />
      </div>
    );
  }

  if (shape === "shout") {
    return (
      <div
        className="absolute -bottom-3 left-8 h-4 w-4 rotate-45 bg-gradient-to-br from-amber-200 to-amber-300"
        style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }}
      />
    );
  }

  if (shape === "faint") {
    return (
      <div className="absolute -bottom-4 left-7 flex gap-0.5 opacity-60">
        <span className="h-1 w-1 rounded-full bg-zinc-300" />
        <span className="h-1 w-1 rounded-full bg-zinc-300" />
        <span className="h-1 w-1 rounded-full bg-zinc-200" />
      </div>
    );
  }

  return (
    <div className="absolute -bottom-2 left-8 h-4 w-4 rotate-45 border-b border-r border-zinc-200 bg-white" />
  );
}

export function ShapePreview({ shape, selected }) {
  const base = `flex h-14 w-full items-center justify-center text-[10px] font-semibold transition-all ${
    selected
      ? "ring-2 ring-violet-500 ring-offset-1 dark:ring-offset-zinc-900"
      : "ring-1 ring-zinc-200 hover:ring-zinc-300 dark:ring-zinc-600 dark:hover:ring-zinc-500"
  }`;

  if (shape === "thought") {
    return (
      <div
        className={`${base} bg-gradient-to-b from-white to-zinc-50 text-zinc-600`}
        style={{ borderRadius: "2rem 2rem 2rem 0.5rem" }}
      >
        ...
      </div>
    );
  }

  if (shape === "shout") {
    return (
      <div
        className={`${base} bg-gradient-to-br from-amber-100 to-amber-200 font-bold uppercase text-amber-900`}
        style={{ clipPath: CLIPS.shoutPreview }}
      >
        !!
      </div>
    );
  }

  if (shape === "caption") {
    return (
      <div className={`${base} rounded-md bg-gradient-to-b from-zinc-800 to-zinc-900 text-white`}>
        Caption
      </div>
    );
  }

  if (shape === "whisper") {
    return (
      <div
        className={`${base} rounded-full border border-dashed border-zinc-400 bg-white/80 text-zinc-500`}
      >
        shh
      </div>
    );
  }

  if (shape === "radio") {
    return (
      <div
        className={`${base} bg-gradient-to-b from-sky-50 to-cyan-100 font-mono uppercase tracking-wide text-cyan-800`}
        style={{ clipPath: CLIPS.radio }}
      >
        *bzzt*
      </div>
    );
  }

  if (shape === "faint") {
    return (
      <div
        className={`${base} rounded-full border border-dotted border-zinc-300 bg-white/60 text-[9px] italic text-zinc-400`}
      >
        ...maybe...
      </div>
    );
  }

  if (shape === "megaphone") {
    return (
      <div
        className={`${base} bg-gradient-to-r from-rose-500 to-orange-500 font-bold uppercase tracking-wide text-white`}
        style={{ clipPath: CLIPS.megaphone }}
      >
        Hey!
      </div>
    );
  }

  return (
    <div className={`${base} rounded-2xl bg-gradient-to-b from-white to-zinc-50 text-zinc-600`}>
      Hi!
    </div>
  );
}

export default function DialogueBubble({
  text,
  shape = "speech",
  editable = false,
  className = "",
  style = {},
}) {
  const shapeStyles = {
    speech:
      "rounded-2xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 text-zinc-800 shadow-lg",
    thought:
      "rounded-[2rem] border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 text-zinc-800 shadow-lg",
    shout:
      "border-2 border-amber-400 bg-gradient-to-br from-amber-100 to-amber-200 font-bold uppercase tracking-wide text-amber-950 shadow-xl",
    caption:
      "rounded-md border border-zinc-700 bg-gradient-to-b from-zinc-900/95 to-zinc-950/95 text-white shadow-lg",
    whisper:
      "rounded-full border border-dashed border-zinc-400 bg-white/80 text-sm italic text-zinc-600 shadow-md backdrop-blur-sm",
    radio:
      "border border-cyan-300 bg-gradient-to-b from-sky-50 to-cyan-100 font-mono uppercase tracking-wide text-cyan-900 shadow-lg",
    faint:
      "rounded-full border border-dotted border-zinc-300 bg-white/60 text-sm italic text-zinc-400 shadow-sm backdrop-blur-sm opacity-90",
    megaphone:
      "border-2 border-rose-400 bg-gradient-to-r from-rose-500 to-orange-500 font-bold uppercase tracking-wide text-white shadow-xl",
  };

  const clipStyle =
    shape === "shout"
      ? { clipPath: CLIPS.shout }
      : shape === "radio"
      ? { clipPath: CLIPS.radio }
      : shape === "megaphone"
      ? { clipPath: CLIPS.megaphone }
      : {};

  return (
    <div
      style={{ ...style, ...clipStyle }}
      className={`relative max-w-[70%] px-4 py-3 text-sm ${shapeStyles[shape] || shapeStyles.speech} ${
        editable ? "cursor-move touch-none ring-2 ring-violet-400" : ""
      } ${className}`}
    >
      <p className={`leading-relaxed ${shape === "shout" || shape === "megaphone" ? "uppercase" : ""}`}>
        {text}
      </p>
      <Tail shape={shape} />
    </div>
  );
}