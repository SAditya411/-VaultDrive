'use client';

export function FileSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/10" />
        <div className="flex-1">
          <div className="h-3.5 bg-white/10 rounded w-3/4 mb-2" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-white/10 rounded w-1/3" />
    </div>
  );
}

export function FolderSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/10" />
        <div className="flex-1">
          <div className="h-4 bg-white/10 rounded w-2/3 mb-2" />
          <div className="h-3 bg-white/10 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-white/10 mb-4" />
      <div className="h-8 bg-white/10 rounded w-1/2 mb-2" />
      <div className="h-3 bg-white/10 rounded w-2/3" />
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <FileSkeleton key={i} />
      ))}
    </div>
  );
}
