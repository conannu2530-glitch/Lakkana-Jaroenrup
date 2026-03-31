import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md", className)} />
);

export const KanbanSkeleton = () => (
  <div className="flex gap-6 overflow-x-auto pb-6 h-full items-start px-4 lg:px-8">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="flex flex-col w-[300px] flex-shrink-0 bg-slate-100/50 dark:bg-slate-800/40 rounded-xl p-3">
        <div className="flex items-center justify-between mb-4 px-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-6 rounded-full" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(j => (
            <div key={j} className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
              <Skeleton className="h-3 w-12 rounded-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
