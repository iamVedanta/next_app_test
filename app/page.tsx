"use client";

import { subDays } from "date-fns";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import "./globals.css";
import { useDebounce } from "@/lib/useDebounce";
import ReportCardDetail from "@/app/components/ReportCardDetail";
import { FaFilter } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import WhatsHappening from "./WhatsHappening";
import SearchBar from "./SearchBar";

import { ScrollArea as SidebarScrollArea } from "@/app/components/ui/scroll-area";

// Define the CrimeReport type, including the 'url' property as it might be present in the database
type CrimeReport = {
  id: string;
  description: string;
  location: string;
  tags: string[];
  rating: number;
  created_at: string;
  crimes: string[];
  upvotes: number | 0;
  downvotes: number | 0;
  url?: string; // Add url to the CrimeReport type as it exists in your CrimeDB table
  category?: string; // Add category to the CrimeReport type as it's used in mapping
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedRatingRange, setSelectedRatingRange] = useState("all");
  const [selectedDateRangeOption, setSelectedDateRangeOption] = useState("all");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const debouncedQuery = useDebounce(query, 300);
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"reports" | "news">("reports");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let supabaseQuery = supabase.from("CrimeDB").select("*");

      if (debouncedQuery.trim()) {
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

      if (selectedDateRangeOption !== "all") {
        if (selectedDateRangeOption === "range" && startDate && endDate) {
          supabaseQuery = supabaseQuery
            .gte("created_at", startDate.toISOString())
            .lte("created_at", endDate.toISOString());
        } else {
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

      // Filter based on activeTab (reports or news)
      if (activeTab === "reports") {
        supabaseQuery = supabaseQuery.is("url", null); // url is null for reports
      } else if (activeTab === "news") {
        supabaseQuery = supabaseQuery.not("url", "is", null); // url is not null for news
      }

      // Explicitly type the data returned from Supabase
      const { data, error } = await supabaseQuery.returns<CrimeReport[]>();

      if (error) {
        console.error("Error fetching crimes:", error);
        setReports([]);
      } else {
        // Map the raw data to the CrimeReport type, handling potential undefined 'crimes' or 'category'
        const formattedReports: CrimeReport[] = (data || []).map((report) => ({
          id: String(report.id),
          description: report.description,
          location: report.location,
          // Use 'category' for 'tags' and fallback to 'category' for 'crimes' if 'crimes' is not present
          tags: report.category ? [report.category] : [],
          rating: report.rating,
          created_at: report.created_at,
          crimes:
            report.crimes && report.crimes.length > 0
              ? report.crimes
              : report.category
              ? [report.category]
              : [],
          upvotes: report.upvotes || 0,
          downvotes: report.downvotes || 0,
          url: report.url, // Include the url
          category: report.category, // Include category if it exists in the database
        }));

        // Sort the reports by created_at in descending order
        const sortedReports = formattedReports.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setReports(sortedReports);
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
    activeTab,
  ]);

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
    setSelectedDateRangeOption("range");
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="w-full lg:w-2/3">
          {/* Sticky Search and Filters */}
          <div className="sticky top-0 z-50 bg-gray-50 dark:bg-gray-900 pt-2 pb-4 space-y-4">
            <SearchBar query={query} onQueryChange={setQuery} />

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-300 dark:border-gray-700">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <FaFilter className="text-lg" />
                <span className="font-semibold text-base">Filters</span>
              </div>

              <label
                htmlFor="rating-filter"
                className="font-medium text-gray-700 dark:text-gray-300 min-w-[90px]"
              >
                Rating:
              </label>
              <select
                id="rating-filter"
                className="min-w-[140px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedRatingRange}
                onChange={(e) => setSelectedRatingRange(e.target.value)}
              >
                <option value="all">All Ratings</option>
                <option value="0-3">0–3 (Low Risk)</option>
                <option value="4-6">4–6 (Medium Risk)</option>
                <option value="7-10">7–10 (High Risk)</option>
              </select>

              <label
                htmlFor="date-filter"
                className="font-medium text-gray-700 dark:text-gray-300 min-w-[90px]"
              >
                Date:
              </label>
              <select
                id="date-filter"
                className="min-w-[140px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <div className="min-w-[220px]">
                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => handleDateRangeChange(update)}
                    isClearable
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select Date Range"
                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
          {/* Tab Switcher */}
          <div className="mt-4">
            <div className="flex border-b border-gray-300 dark:border-gray-700 w-full overflow-auto">
              <button
                className={`flex-1 min-w-[120px] px-4 py-2 text-center text-sm font-semibold ${
                  activeTab === "reports"
                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300"
                }`}
                onClick={() => setActiveTab("reports")}
              >
                Reports
              </button>
              <button
                className={`flex-1 min-w-[120px] px-4 py-2 text-center text-sm font-semibold ${
                  activeTab === "news"
                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300"
                }`}
                onClick={() => setActiveTab("news")}
              >
                News Reports
              </button>
            </div>
          </div>

          {/* Report List */}
          <div className="w-full px-2 py-4">
            {loading ? (
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            ) : reports.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                No matching reports found.
              </p>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <ReportCardDetail key={report.id} report={{ ...report }} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* WhatsHappening Sidebar */}
        <div className="hidden lg:block w-full lg:w-1/3">
          <div className="sticky top-0 z-40">
            <SidebarScrollArea className="h-[calc(100vh-3rem)] pr-2">
              <WhatsHappening />
            </SidebarScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
