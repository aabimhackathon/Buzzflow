import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg ${className}`}
    />
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6" id="dashboard-skeleton">
      {/* Welcome Banner Skeleton */}
      <div className="p-6 rounded-3xl bg-slate-800 dark:bg-slate-900 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2.5 w-full md:w-2/3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24 rounded-full bg-slate-700" />
            <Skeleton className="h-3 w-32 bg-slate-700" />
          </div>
          <Skeleton className="h-8 w-64 bg-slate-700" />
          <Skeleton className="h-4 w-96 max-w-full bg-slate-700" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Skeleton className="h-10 w-28 rounded-2xl bg-slate-700" />
          <Skeleton className="h-10 w-28 rounded-2xl bg-slate-700" />
        </div>
      </div>

      {/* KPI Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-60" />
          </div>
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>

      {/* Activity Feed & Vouchers Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <Skeleton className="h-5 w-36" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AccountingEngineSkeleton: React.FC = () => {
  return (
    <div className="space-y-6" id="accounting-skeleton">
      {/* Top Sub-Bar Skeleton */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-xl flex-shrink-0" />
        ))}
      </div>

      {/* Main Table / Form Area Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        {/* Header & Filter Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-3.5 w-72" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
        </div>

        {/* Table Rows Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-800/80" />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
