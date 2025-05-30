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

// import { Card, CardContent } from "@/app/components/ui/card";
// import { Button } from "@/app/components/ui/button";
// import { ScrollArea } from "@/app/components/ui/scroll-area";
// import { Badge } from "@/app/components/ui/badge";

// Patch: Make WhatsHappening scrollable
import { ScrollArea as SidebarScrollArea } from "@/app/components/ui/scroll-area";

// Patch: Expandable description
// import { useRef } from "react";

// const ExpandableText = ({ text }: { text: string }) => {
//   const [expanded, setExpanded] = useState(false);
//   const toggleExpanded = () => setExpanded(!expanded);
//   const shouldShowButton = text.length > 150;
//   const shortText = text.slice(0, 150) + (shouldShowButton ? "..." : "");

//   return (
//     <div>
//       <p>{expanded ? text : shortText}</p>
//       {shouldShowButton && (
//         <Button
//           className="px-0 text-blue-600 dark:text-blue-400"
//           onClick={toggleExpanded}
//         >
//           {expanded ? "Show Less" : "Read More"}
//         </Button>
//       )}
//     </div>
//   );
// };

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

      const { data, error } = await supabaseQuery;
      if (error) {
        console.error("Error fetching crimes:", error);
        setReports([]);
      } else {
        const sortedReports = (data as CrimeReport[]).sort(
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
