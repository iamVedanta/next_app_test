"use client";

import { FaSearch } from "react-icons/fa";

// Define the interface for your component's props
interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void; // This is a function that takes a string and returns void
  // Or, if you prefer to be explicit about React's setState function:
  // onQueryChange: Dispatch<SetStateAction<string>>;
}

// Ensure the props are correctly destructured and typed in the function signature
export default function SearchBar({ query, onQueryChange }: SearchBarProps) {
  return (
    <div className="sticky top-0 z-50 mt-4 flex items-center mb-6 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
      <FaSearch className="text-gray-500 dark:text-gray-300 mr-3" />
      <input
        type="text"
        placeholder="Search by description or location..."
        className="w-full px-4 py-2 border-none focus:outline-none focus:ring-1 focus:ring-blue-500 bg-transparent dark:text-white rounded-lg"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
    </div>
  );
}
