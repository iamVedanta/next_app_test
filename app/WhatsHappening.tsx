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
  if (!location) return "Unknown Location";
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
    router.push(`/reports/${id}`);
  };

  const showMore = () => {
    setExpanded(true);
    setLimit((prev) => prev + 5);
  };

  return (
    <aside
      className="relative w-full max-w-md p-6 bg-white text-black dark:bg-gray-900 dark:text-white rounded-lg shadow-lg transition-colors duration-300"
      style={{
        maxHeight: expanded ? "400px" : "calc(5 * 7.5rem + 2.5rem)",
        overflowY: expanded ? "auto" : "hidden",
        transition: "max-height 0.3s ease",
      }}
    >
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 dark:border-gray-700 pb-3 sticky top-0 bg-white dark:bg-gray-900 z-10">
        What&apos;s Happening{" "}
        <span className="text-xs">(work in progress)</span>
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
                       hover:shadow-lg hover:bg-sky-50 dark:hover:bg-sky-900
                       transition-all duration-300 hover:scale-[1.01]"
            style={{ minHeight: "7.5rem" }}
          >
            <p className="text-lg font-medium mb-2 line-clamp-3">
              {description}
            </p>

            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-sky-500" />
                {extractCity(location)}
              </span>

              <span className="flex items-center text-yellow-500 font-semibold gap-1">
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
          <div className="pointer-events-none absolute bottom-14 left-0 w-full h-20 bg-gradient-to-b from-transparent to-white dark:to-gray-900 z-10" />

          <button
            onClick={showMore}
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-sky-600 hover:bg-sky-700 
                       text-white rounded-full shadow-md transition hover:scale-105 active:scale-95 z-20"
          >
            Show More
          </button>
        </>
      )}
    </aside>
  );
}
