export default function NotesLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="bg-muted h-8 w-32 animate-pulse rounded" />
        <div className="bg-muted h-4 w-80 max-w-full animate-pulse rounded" />
      </div>
      <div className="bg-muted/40 h-40 animate-pulse rounded-xl border" />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-muted/40 h-14 animate-pulse rounded" />
        ))}
      </div>
    </div>
  );
}
