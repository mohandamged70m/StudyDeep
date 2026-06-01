"use client";

import React from 'react';

export function SourceSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-800/80 bg-zinc-950 overflow-hidden animate-pulse">
      <div className="border-b border-zinc-800/80 bg-zinc-900/45 px-4 py-3 space-y-3">
        <div className="h-3 w-24 bg-zinc-800 rounded" />
        <div className="h-4 w-32 bg-zinc-800 rounded" />
        <div className="flex gap-2">
          <div className="h-12 flex-1 bg-zinc-800/60 rounded-lg" />
          <div className="h-12 flex-1 bg-zinc-800/60 rounded-lg" />
        </div>
      </div>
      <div className="flex-1 p-4 space-y-2.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-zinc-800/40 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-800/80 bg-zinc-950 overflow-hidden animate-pulse">
      <div className="border-b border-zinc-800/80 bg-zinc-900/45 px-4 py-3 space-y-2">
        <div className="h-3 w-20 bg-zinc-800 rounded-full" />
        <div className="h-4 w-40 bg-zinc-800 rounded" />
      </div>
      <div className="flex-1 p-4 space-y-4">
        <div className="flex justify-start">
          <div className="h-20 w-3/4 bg-zinc-800/40 rounded-2xl rounded-bl-none" />
        </div>
        <div className="flex justify-end">
          <div className="h-12 w-1/2 bg-zinc-800/30 rounded-2xl rounded-br-none" />
        </div>
        <div className="flex justify-start">
          <div className="h-28 w-4/5 bg-zinc-800/40 rounded-2xl rounded-bl-none" />
        </div>
      </div>
    </div>
  );
}

export function StudyToolsSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-800/80 bg-zinc-950 overflow-hidden animate-pulse">
      <div className="border-b border-zinc-800/80 bg-zinc-900/45 px-4 py-3">
        <div className="flex gap-1">
          <div className="h-7 w-20 bg-zinc-800 rounded-lg" />
          <div className="h-7 w-24 bg-zinc-800 rounded-lg" />
          <div className="h-7 w-28 bg-zinc-800 rounded-lg" />
        </div>
      </div>
      <div className="flex-1 p-4 space-y-3">
        <div className="h-4 w-3/4 bg-zinc-800/40 rounded" />
        <div className="h-3 w-full bg-zinc-800/30 rounded" />
        <div className="h-3 w-5/6 bg-zinc-800/30 rounded" />
        <div className="h-3 w-4/6 bg-zinc-800/30 rounded" />
        <div className="h-3 w-full bg-zinc-800/30 rounded" />
      </div>
    </div>
  );
}

export function PodcastSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-zinc-800/80 bg-zinc-950 overflow-hidden animate-pulse">
      <div className="p-4 border-b border-zinc-800 space-y-2">
        <div className="h-3 w-28 bg-zinc-800 rounded" />
        <div className="h-3 w-44 bg-zinc-800/60 rounded" />
      </div>
      <div className="p-4 space-y-4">
        <div className="h-20 bg-zinc-800/40 rounded-2xl" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-zinc-800/30 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
