type UserProfileProps = {
  isCompact: boolean;
};

// Static placeholder until auth/user data is wired up.
export function UserProfile({ isCompact }: UserProfileProps) {
  return (
    <div className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 transition-colors hover:bg-slate-800">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-200">
        JD
      </div>
      {!isCompact && (
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm font-medium text-slate-100">John Doe</span>
          <span className="truncate text-xs text-slate-400">john.doe@gmail.com</span>
        </div>
      )}
    </div>
  );
}
