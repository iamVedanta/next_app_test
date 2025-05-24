"use client";
import "./globals.css";
import "../styles/styles.css";
import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useDebounce } from "@/lib/useDebounce";
import CommentModal from "./CommentModal";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaFilter,
  FaShareAlt,
  FaCommentDots,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import WhatsHappening from "./WhatsHappening";

type CrimeReport = {
  id: string;
  description: string;
  location: string;
  tags: string[];
  rating: number;
  created_at: string;
  crimes: string[];
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedRatingRange, setSelectedRatingRange] = useState<string>("all");
  const [selectedDateRangeOption, setSelectedDateRangeOption] =
    useState<string>("all");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const debouncedQuery = useDebounce(query, 300);
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState<string | null>(
    null
  );
  const [isCommentOpen, setIsCommentOpen] = useState<boolean>(false);
  const [activeReportId, setActiveReportId] = useState<string | number | null>(
    null
  );
  const [commentText, setCommentText] = useState<string>("");

  const handleCommentClick = (id: string | number) => {
    setActiveReportId(id);
    setIsCommentOpen(true);
  };

  const handleCommentSubmit = (comment: string, reportId: string | number) => {
    console.log("Submitted Comment:", comment, "for Report ID:", reportId);
    // Add API call or logic here
  };

  const handleShare = (id: string | number) => {
    // logic for sharing (e.g., copy link, invoke share API)
    console.log("Share clicked for report ID:", id);
  };

  const handleComment = (id: string | number) => {
    // logic for opening comment section/modal
    console.log("Comment clicked for report ID:", id);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let supabaseQuery = supabase.from("CrimeDB").select("*");

      // Search filter
      if (debouncedQuery.trim()) {
        console.log("Searching with query:", debouncedQuery);
        supabaseQuery = supabaseQuery.or(
          `description.ilike.%${debouncedQuery}%,location.ilike.%${debouncedQuery}%`
        );
      }

      // Rating filter
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

      // Date filter
      if (selectedDateRangeOption !== "all") {
        if (selectedDateRangeOption === "range" && startDate && endDate) {
          supabaseQuery = supabaseQuery
            .gte("created_at", startDate.toISOString())
            .lte("created_at", endDate.toISOString());
        } else if (selectedDateRangeOption !== "range") {
          let dateLimit = new Date();
          if (selectedDateRangeOption === "last24h") {
            dateLimit = subDays(new Date(), 1);
          } else if (selectedDateRangeOption === "last7d") {
            dateLimit = subDays(new Date(), 7);
          } else if (selectedDateRangeOption === "last30d") {
            dateLimit = subDays(new Date(), 30);
          }
          supabaseQuery = supabaseQuery.gte(
            "created_at",
            dateLimit.toISOString()
          );
        }
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
  }, [
    debouncedQuery,
    selectedRatingRange,
    dateRange,
    selectedDateRangeOption,
    startDate,
    endDate,
  ]);

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

  const handleCardClick = (id: string) => {
    setExpandedDescription((prev) => (prev === id ? null : id));
  };

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
    setSelectedDateRangeOption("range");
  };

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between px-4 lg:px-20 py-8">
      <div className="dark:bg-orange-800 max-w-3xl mx-auto px-6 py-8 rounded-lg shadow-lg dark:text-white main-feed">
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

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded-lg shadow-md">
          <FaFilter className="text-teal-500 dark:text-teal-300 mr-2" />

          <label htmlFor="rating-filter" className="font-semibold text-sm">
            Rating:
          </label>
          <select
            id="rating-filter"
            className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-none focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg p-2"
            value={selectedRatingRange}
            onChange={(e) => setSelectedRatingRange(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="0-3">0–3 (Low Risk)</option>
            <option value="4-6">4–6 (Medium Risk)</option>
            <option value="7-10">7–10 (High Risk)</option>
          </select>

          <label htmlFor="date-filter" className="font-semibold text-sm ml-4">
            Date:
          </label>
          <select
            id="date-filter"
            className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-none focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg p-2"
            value={selectedDateRangeOption}
            onChange={(e) => {
              setSelectedDateRangeOption(e.target.value);
              if (e.target.value !== "range") {
                setDateRange([null, null]);
              }
            }}
          >
            <option value="all">All Dates</option>
            <option value="last24h">Last 24 Hours</option>
            <option value="last7d">Last 7 Days</option>
            <option value="last30d">Last 30 Days</option>
            <option value="range">Date Range</option>
          </select>

          {selectedDateRangeOption === "range" && (
            <div className="flex items-center ml-4">
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => handleDateRangeChange(update)}
                isClearable={true}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select Date Range"
                className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-none focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg p-2 text-sm"
              />
            </div>
          )}
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
                expandedDescription === report.id
                  ? report.description
                  : report.description.slice(0, 150) + (isLong ? "..." : "");

              return (
                <div
                  key={report.id}
                  onClick={() => handleCardClick(report.id)}
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
                    {report.crimes?.map((tag, index) => (
                      <span
                        key={index}
                        className={`inline-block font-semibold ${getBackgroundColor(
                          report.rating
                        )} text-white px-3 py-1 rounded-full text-xs mr-2`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p
                    className="text-lg text-gray-800 dark:text-gray-100"
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
                  <p className="text-xs text-gray-500 dark:text-gray-200 mt-2">
                    {format(new Date(report.created_at), "d MMMM yyyy, h:mm a")}
                  </p>

                  <div className="flex justify-end space-x-4 mt-4">
                    <button
                      onClick={() => handleShare(report.id)}
                      className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 text-sm font-medium"
                    >
                      <FaShareAlt />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() => handleComment(report.id)}
                      className="flex items-center space-x-1 text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      <FaCommentDots />
                      {/* <span>Comment</span> */}
                      <CommentModal
                        isOpen={isCommentOpen}
                        onClose={() => setIsCommentOpen(false)}
                        onSubmit={handleCommentSubmit}
                        reportId={activeReportId}
                        commentText={commentText}
                        setCommentText={setCommentText}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <WhatsHappening />
    </div>
  );
}
