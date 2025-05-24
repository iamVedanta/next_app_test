"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { format, subDays, subHours } from "date-fns";
import SearchBar from "./SearchBar";
import Filters from "./Filters";
import CrimeList from "./CrimeList";
import CommentModal from "./CommentModal";
import WhatsHappening from "./WhatsHappening";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedRatingRange, setSelectedRatingRange] = useState("all");
  const [selectedDateRangeOption, setSelectedDateRangeOption] = useState("all");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [expandedDescription, setExpandedDescription] = useState<string | null>(
    null
  );
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetchReports();
  }, [query, selectedRatingRange, selectedDateRangeOption, dateRange]);

  const fetchReports = async () => {
    setLoading(true);

    let queryBuilder = supabase.from("crime_reports").select("*");

    if (query) {
      queryBuilder = queryBuilder.or(
        `description.ilike.%${query}%,location.ilike.%${query}%`
      );
    }

    if (selectedRatingRange !== "all") {
      const [min, max] = selectedRatingRange.split("-");
      queryBuilder = queryBuilder
        .gte("rating", Number(min))
        .lte("rating", Number(max));
    }

    if (selectedDateRangeOption !== "all") {
      const now = new Date();

      if (selectedDateRangeOption === "last24h") {
        queryBuilder = queryBuilder.gte(
          "created_at",
          subHours(now, 24).toISOString()
        );
      } else if (selectedDateRangeOption === "last7d") {
        queryBuilder = queryBuilder.gte(
          "created_at",
          subDays(now, 7).toISOString()
        );
      } else if (selectedDateRangeOption === "last30d") {
        queryBuilder = queryBuilder.gte(
          "created_at",
          subDays(now, 30).toISOString()
        );
      } else if (
        selectedDateRangeOption === "range" &&
        dateRange[0] &&
        dateRange[1]
      ) {
        queryBuilder = queryBuilder
          .gte("created_at", dateRange[0].toISOString())
          .lte("created_at", dateRange[1].toISOString());
      }
    }

    const { data, error } = await queryBuilder.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching reports:", error.message);
      setReports([]);
    } else {
      setReports(data || []);
    }

    setLoading(false);
  };

  const getBorderColor = (rating: number) => {
    if (rating <= 3) return "border-green-500";
    if (rating <= 6) return "border-yellow-400";
    return "border-red-500";
  };

  const getBackgroundColor = (rating: number) => {
    if (rating <= 3) return "bg-green-500";
    if (rating <= 6) return "bg-yellow-400";
    return "bg-red-500";
  };

  const handleCardClick = (id: string) => {
    setExpandedDescription((prev) => (prev === id ? null : id));
  };

  const handleShare = (id: string) => {
    alert(`Shared report id: ${id}`);
  };

  const handleCommentClick = (id: string) => {
    setActiveReportId(id);
    setIsCommentOpen(true);
  };

  const handleCommentSubmit = (comment: string, reportId: string) => {
    console.log("Comment submitted:", comment, "for report:", reportId);
    setIsCommentOpen(false);
    setCommentText("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
      <SearchBar query={query} setQuery={setQuery} />
      <Filters
        selectedRatingRange={selectedRatingRange}
        setSelectedRatingRange={setSelectedRatingRange}
        selectedDateRangeOption={selectedDateRangeOption}
        setSelectedDateRangeOption={setSelectedDateRangeOption}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <CrimeList
        reports={reports}
        loading={loading}
        expandedDescription={expandedDescription}
        onCardClick={handleCardClick}
        onShare={handleShare}
        onComment={handleCommentClick}
        getBorderColor={getBorderColor}
        getBackgroundColor={getBackgroundColor}
      />
      {isCommentOpen && activeReportId && (
        <CommentModal
          isOpen={isCommentOpen}
          onClose={() => setIsCommentOpen(false)}
          onSubmit={(comment) => handleCommentSubmit(comment, activeReportId!)}
          commentText={commentText} // Correct prop name
          setCommentText={setCommentText} // Correct prop name
          reportId={activeReportId} // You forgot to pass reportId
        />
      )}
      <WhatsHappening />
    </div>
  );
}
