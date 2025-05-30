"use client";

import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export default function SearchBar({ query, onQueryChange }: SearchBarProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div
        className="flex items-center gap-3 p-3 sm:p-4 rounded-full bg-white/60 dark:bg-white/10
        backdrop-blur-md border border-white/30 dark:border-white/20 shadow-lg hover:shadow-xl
        transition-all duration-300"
      >
        <div className="flex items-center justify-center p-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-md">
          <FaSearch className="h-4 w-4 text-white" />
        </div>
        <input
          type="text"
          placeholder="Search by description or location..."
          className="flex-1 bg-transparent text-sm sm:text-base placeholder-gray-500 dark:placeholder-gray-400
          text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500
          px-2 py-1 transition-all duration-200"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>
    </div>
  );
}
