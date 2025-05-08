"use client";
import "./globals.css";
import "../styles/styles.css";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useDebounce } from "@/lib/useDebounce";
import { FaMapMarkerAlt, FaSearch, FaFilter } from "react-icons/fa";

type CrimeReport = {
  crimeID: string;
  description: string;
  location: string;
  tags: string[];
  rating: number;
  createdAt: string;
  crimes: string[];
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedRatingRange, setSelectedRatingRange] = useState<string>("all");
  const debouncedQuery = useDebounce(query, 300);
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let supabaseQuery = supabase.from("crimedb").select("*");

      if (debouncedQuery.trim()) {
        console.log("Searching with query:", debouncedQuery);
        supabaseQuery = supabaseQuery.or(
          `description.ilike.%${debouncedQuery}%,location.ilike.%${debouncedQuery}%`
        );
      }

      if (selectedRatingRange !== "all") {
        let [minRating, maxRating] = [0, 10];
        if (selectedRatingRange === "0-3") [minRating, maxRating] = [0, 3];
        else if (selectedRatingRange === "4-6") [minRating, maxRating] = [4, 6];
        else if (selectedRatingRange === "7-10")
          [minRating, maxRating] = [7, 10];
        supabaseQuery = supabaseQuery
          .gte("rating", minRating)
          .lte("rating", maxRating);
      }

      const { data, error } = await supabaseQuery;
      if (error) {
        console.error("Error fetching crimes:", error);
        setReports([]);
      } else {
        setReports(data as CrimeReport[]);
      }
      setLoading(false);
    };

    fetchData();
  }, [debouncedQuery, selectedRatingRange]);

  const getBorderColor = (rating: number) => {
    const colors = [
      "border-green-500",
      "border-green-400",
      "border-teal-500",
      "border-teal-400",
      "border-yellow-500",
      "border-yellow-400",
      "border-yellow-300",
      "border-orange-500",
      "border-orange-400",
      "border-red-500",
      "border-red-400",
    ];
    return colors[rating] || "border-gray-300";
  };

  const getBackgroundColor = (rating: number) => {
    const colors = [
      "bg-green-500",
      "bg-green-400",
      "bg-teal-500",
      "bg-teal-400",
      "bg-yellow-500",
      "bg-yellow-400",
      "bg-yellow-300",
      "bg-orange-500",
      "bg-orange-400",
      "bg-red-500",
      "bg-red-400",
    ];
    return colors[rating] || "bg-gray-300";
  };

  const handleCardClick = (crimeID: string) => {
    setExpandedDescription((prev) => (prev === crimeID ? null : crimeID));
  };

  return (
    <div className="bg-orange-100 dark:bg-orange-800 max-w-3xl mx-auto px-6 py-8 rounded-lg shadow-lg dark:text-white">
      {/* Search bar */}
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

      {/* Filter */}
      <div className="flex items-center mb-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2 rounded-lg shadow-md">
        <FaFilter className="text-teal-500 dark:text-teal-300 mr-3" />
        <label
          htmlFor="rating-filter"
          className="mr-2 font-semibold text-gray-700 dark:text-gray-300"
        >
          Filter by Safety Rating:
        </label>
        <select
          id="rating-filter"
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-none focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg p-2"
          value={selectedRatingRange}
          onChange={(e) => setSelectedRatingRange(e.target.value)}
        >
          <option value="all">All Ratings</option>
          <option value="0-3">0-3 (Low Risk)</option>
          <option value="4-6">4-6 (Medium Risk)</option>
          <option value="7-10">7-10 (High Risk)</option>
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-300">Loading...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">
          No matching reports found.
        </p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const isLong = report.description.length > 150;
            const description =
              expandedDescription === report.crimeID
                ? report.description
                : report.description.slice(0, 150) + (isLong ? "..." : "");

            const date = new Date(report.createdAt).toLocaleDateString();

            return (
              <div
                key={report.crimeID}
                onClick={() => handleCardClick(report.crimeID)}
                className={`p-5 rounded-xl shadow-md transition duration-300 ease-in-out ${getBorderColor(
                  report.rating
                )} border-4 hover:shadow-lg cursor-pointer bg-white dark:bg-gray-700`}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-gray-400 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-xs">
                    A
                  </div>
                  <p className="ml-4 text-gray-800 dark:text-gray-100 font-semibold text-sm">
                    Anonymous User
                  </p>
                </div>

                <div className="mb-2">
                  {report.crimes?.map((tag, index) => {
                    const bgColorClass = getBackgroundColor(report.rating);
                    return (
                      <span
                        key={index}
                        className={`inline-block font-semibold ${bgColorClass} text-white px-3 py-1 rounded-full text-xs mr-2`}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>

                <p
                  className="text-lg  text-gray-800 dark:text-gray-100"
                  style={{
                    fontFamily: "Helvetica, sans-serif",
                    fontSize: "14px",
                  }}
                >
                  {description}
                </p>
                <div className="flex justify-between items-center mt-2 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-orange-500 dark:text-orange-300 mr-1" />
                    <p>{report.location}</p>
                  </div>
                  <div className="text-right mt-2 md:mt-0">
                    <span className="font-semibold">Safety Rating: </span>
                    <span
                      className={`transition duration-300 ease-in-out ${
                        report.rating <= 3
                          ? "text-green-500"
                          : report.rating <= 6
                          ? "text-yellow-400"
                          : "text-red-500"
                      }`}
                    >
                      {report.rating}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Posted at: {date}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
