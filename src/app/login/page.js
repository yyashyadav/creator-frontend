import Link from "next/link";

export const metadata = {
  title: "Log in — Creator",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">Welcome back</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Log in to your Creator account
        </p>

        <p className="mt-8 rounded-lg bg-violet-50 px-4 py-3 text-sm text-violet-700">
          Login form coming in Step 4 (Authentication UI).
        </p>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-violet-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
