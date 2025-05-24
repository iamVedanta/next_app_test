import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
}

export default function SearchBar({ query, setQuery }: SearchBarProps) {
  return (
    <div className="sticky top-0 z-50 mt-4 flex items-center mb-6 bg-white dark:bg-gray-700 p-2 rounded-lg shadow-md">
      <FaSearch className="text-teal-500 dark:text-teal-300 mr-3" />
      <input
        type="text"
        placeholder="Search by description or location..."
        className="w-full px-4 py-2 border-none focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white rounded-lg"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
