import Link from "next/link";

export default function Landing() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-black">
      <h1 className="text-6xl font-bold text-white">InterAI</h1>
      <Link
        href="/chat"
        className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black transition-colors hover:bg-slate-200"
      >
        Login to begin chatting with InterAI
      </Link>
    </div>
  );
}

