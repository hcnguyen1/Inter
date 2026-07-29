export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">

        <aside className="flex w-72 flex-col gap-4 bg-slate-900 p-4">
          <div className="text-sm font-semibold text-slate-100">InterAI</div>
          <div className="h-px w-full bg-slate-700" />
          <button className="w-full rounded px-2 py-2 text-left text-sm font-semibold text-white bg-transparent">
            + New chat
          </button>
          <div className="mt-auto text-xs text-slate-400">
            Start a new conversation or continue one from the sidebar.
          </div>
        </aside>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex flex-1 items-center justify-center rounded bg-slate-800">
            <div className="text-sm text-slate-400">
              Select a conversation or start a new one.
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}
