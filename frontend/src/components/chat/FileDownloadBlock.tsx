"use client";

import { FiDownload, FiFileText } from "react-icons/fi";

type FileDownloadBlockProps = {
  filename: string;
  content: string;
};

// Renders AI-generated file content as a downloadable file in the browser (no server writes).
export function FileDownloadBlock({ filename, content }: FileDownloadBlockProps) {
  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="my-2 flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-xs">
      <FiFileText className="shrink-0 text-slate-400" />
      <span className="flex-1 truncate font-mono">{filename}</span>
      <button
        type="button"
        onClick={handleDownload}
        aria-label={`Download ${filename}`}
        className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-900 transition-colors hover:bg-white"
      >
        <FiDownload /> Download
      </button>
    </div>
  );
}
