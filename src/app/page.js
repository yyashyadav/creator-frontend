import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold tracking-tight text-violet-600">
            Creator
          </span>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-4 inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
          Comic-to-Video Platform
        </div>

        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
          Turn your comic scenes into{" "}
          <span className="text-violet-600">animated videos</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-500">
          Upload character images, write dialogues, set scene durations — and
          generate a downloadable MP4 video. No video-editing skills required.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/register"
            className="rounded-xl bg-violet-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-violet-700"
          >
            Start Creating Free
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-zinc-300 px-8 py-3 text-base font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            Sign In
          </Link>
        </div>

        {/* Feature cards */}
        <div className="mt-24 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              title: "Add Scenes",
              desc: "Upload character images and write dialogues for each scene.",
            },
            {
              title: "Preview Animation",
              desc: "See fade-in, speech bubbles, and typing effects live.",
            },
            {
              title: "Export MP4",
              desc: "Generate and download a 1080p animated video.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-sm"
            >
              <h3 className="font-semibold text-zinc-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-400">
        Creator — Storytelling made simple
      </footer>
    </div>
  );
}
