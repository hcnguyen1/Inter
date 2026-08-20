"use client";

import { useState } from "react";

export default function Home() {
  const [isCompact, setIsCompact] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className={`flex ${isCompact ? "w-16" : "w-72"} flex-col gap-4 bg-slate-900 p-4 transition-[width]`}>
          <div className="flex items-center justify-between">
            {!isCompact && (
              <div className="text-sm font-semibold text-slate-100">InterAI</div>
            )}
            <button
              onClick={() => setIsCompact((prev) => !prev)}
              aria-label="Toggle compact mode"
              className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
            >
              «»
            </button>
          </div>
          <div className="h-px w-full bg-slate-700" />
          <button className={`w-full rounded px-2 py-2 ${isCompact ? "text-center" : "text-left"} text-sm font-semibold text-white bg-transparent transition-colors hover:bg-slate-800`}>
            {isCompact ? "+" : "+ New chat"}
          </button>
          {!isCompact && (
            <div className="mt-auto text-xs text-slate-400">
              Start a new conversation or continue one from the sidebar.
            </div>
          )}
        </aside>

        {/* Chat panel */}
        <main className="flex flex-1 flex-col gap-4 p-4">
          {/* Conversation area */}
          <div className="flex flex-1 items-center justify-center rounded bg-slate-800">
            <div className="text-sm text-slate-400">
              Select a conversation or start a new one.
            </div>
          </div>

          {/* Message input bar */}
          <form className="flex">
            <div className="flex w-full items-center gap-2 rounded-full bg-slate-800 px-4 py-2">
              <input
                type="text"
                placeholder="Message InterAI..."
                className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-400 outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900 transition-colors hover:bg-white"
              >
                Send
              </button>
            </div>
          </form>
        </main>

      </div>
    </div>
  );
}
