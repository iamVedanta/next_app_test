"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

type CrimeReport = {
  id: string;
  location: string;
  description: string;
  rating: number;
  created_at: string;
};

function extractCity(location: string) {
  const parts = location.split(",");
  if (parts.length >= 2) return parts[1].trim();
  return location;
}

export default function WhatsHappening() {
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(5);
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("CrimeDB")
        .select("id, location, description, rating, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching reports:", error);
        setReports([]);
      } else {
        setReports(data as CrimeReport[]);
      }
      setLoading(false);
    };
    fetchReports();
  }, [limit]);

  const handlePostClick = (id: string) => {
    router.push(`/posts/${id}`);
  };

  const showMore = () => {
    setExpanded(true);
    setLimit((prev) => prev + 5);
  };

  return (
    <aside
      className={`whats-happening p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md relative flex flex-col `}
      style={{
        maxHeight: expanded ? "400px" : "calc(5 * 7.5rem + 2.5rem)",
        overflowY: expanded ? "auto" : "hidden",
        transition: "max-height 0.3s ease",
      }}
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-3 border-gray-300 dark:border-gray-700 select-none sticky top-0 z-10 bg-white dark:bg-gray-900">
        What &apos;s Happening(work under progressss)
      </h2>

      {loading && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading reports...
        </p>
      )}

      {!loading && reports.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No reports found.
        </p>
      )}

      <ul className="space-y-6">
        {reports.map(({ id, location, description, rating, created_at }) => (
          <li
            key={id}
            onClick={() => handlePostClick(id)}
            className="cursor-pointer p-4 rounded-lg border border-gray-200 dark:border-gray-700
              hover:shadow-xl hover:bg-sky-50 dark:hover:bg-sky-900
              transition-all duration-300 ease-in-out
              transform hover:scale-[1.02] will-change-transform"
            title="Click to view details"
            style={{ minHeight: "7.5rem" }}
          >
            <p className="text-gray-800 dark:text-gray-100 text-lg font-semibold mb-2 line-clamp-3">
              {description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
              <span className="flex items-center space-x-1">
                <FaMapMarkerAlt className="text-sky-500" />
                <span>{extractCity(location)}</span>
              </span>

              <span className="flex items-center space-x-1 text-yellow-500 font-semibold">
                <span>⭐</span>
                <span>{rating}</span>
              </span>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(created_at).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </li>
        ))}
      </ul>

      {!expanded && reports.length >= 5 && (
        <>
          <div
            className="pointer-events-none absolute bottom-12 left-0 w-full h-16"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
              clipPath: "inset(0 0 0 0 round 1rem)",
            }}
          />
          <div
            className="pointer-events-none absolute bottom-12 left-0 w-full h-16 dark:hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
              clipPath: "inset(0 0 0 0 round 1rem)",
            }}
          />
          <div
            className="pointer-events-none absolute bottom-12 left-0 w-full h-16 dark:block hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(17,24,39,1) 100%)",
              clipPath: "inset(0 0 0 0 round 1rem)",
            }}
          />

          <button
            onClick={showMore}
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-full shadow-md transition duration-300 ease-in-out
              hover:scale-105 hover:animate-pulse active:scale-95 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-700"
            aria-label="Show more posts"
          >
            Show More
          </button>
        </>
      )}
    </aside>
  );
}
