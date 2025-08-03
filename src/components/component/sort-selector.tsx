"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation.js";

export const SortSelector = () => {
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const sortOptions = [
    { value: "newest", label: "最新順" },
    { value: "oldest", label: "古い順" },
  ];

  return (
    <div className="mb-4 flex gap-2">
      {sortOptions.map((option) => (
        <Link
          key={option.value}
          href={`?sort=${option.value}`}
          className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm ${
            currentSort === option.value
              ? "bg-orange-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
};
