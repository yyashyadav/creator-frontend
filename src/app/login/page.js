import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Log in — Creator",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <Link href="/" className="text-sm font-medium text-violet-600 hover:underline">
          ← Back to home
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900">Welcome back</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Log in to your Creator account
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
