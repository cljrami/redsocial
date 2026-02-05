import React from 'react';

export default function PostSkeleton() {
  return (
    <div className="bg-white dark:bg-[#242526] rounded-xl shadow-sm border border-gray-200 dark:border-[#3E4042] p-4 mb-4 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#3A3B3C]"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-[#3A3B3C] rounded w-1/3"></div>
          <div className="h-2 bg-gray-100 dark:bg-[#3E4042] rounded w-1/4"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 dark:bg-[#3A3B3C] rounded w-full"></div>
        <div className="h-3 bg-gray-200 dark:bg-[#3A3B3C] rounded w-5/6"></div>
        <div className="h-[300px] bg-gray-100 dark:bg-[#3A3B3C] rounded-xl mt-4"></div>
      </div>
    </div>
  );
}