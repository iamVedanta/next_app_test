import { useState } from "react";
import { format } from "date-fns";
import { MapPin, Calendar, Shield, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ShareButton from "../ShareButton";
import LocationIcon from "../LocationIcon";
import VoteButtons from "../VoteButtons";
import CommentSection from "../CommentSection";
import Link from "next/link";
interface ReportCardDetailProps {
  report: {
    id: string;
    description: string;
    location: string;
    tags: string[];
    rating: number;
    created_at: string;
    crimes: string[];
    upvotes: number | 0;
    downvotes: number | 0;
  };
}

export default function ReportCardDetail({ report }: ReportCardDetailProps) {
  const [showFullLocation, setShowFullLocation] = useState(false);

  const safetyRating = Math.abs(report.rating) || 1;
  // const getRatingColor = (rating: number) => {
  //   if (rating >= 8) return "text-emerald-600 dark:text-emerald-400";
  //   if (rating >= 6) return "text-yellow-600 dark:text-yellow-400";
  //   if (rating >= 4) return "text-orange-600 dark:text-orange-400";
  //   return "text-red-600 dark:text-red-400";
  // };

  const getCrimeTagColor = (index: number) => {
    const colors = [
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden w-full">
      <Link key={report.id} href={`/reports/${report.id}`} passHref>
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-gray-50/30 dark:from-gray-800/50 dark:to-gray-900/30 pointer-events-none" />

        <div className="relative p-4 sm:p-6 space-y-4">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center shadow-sm">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Anonymous User
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Verified Reporter
                </p>
              </div>
            </div>

            {/* Safety Rating Badge */}
            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
              <Shield className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Safety Rating:
              </span>
              <div className="flex items-center space-x-0.5">
                {Array.from({ length: 5 }).map((_, index) => {
                  const filled = index < Math.round(safetyRating / 2);
                  return (
                    <svg
                      key={index}
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill={filled ? "#facc15" : "none"}
                      stroke="#facc15"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                      />
                    </svg>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Crime Tags */}
          {report.crimes && report.crimes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {report.crimes.map((crime, index) => (
                <span
                  key={index}
                  className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                    getCrimeTagColor(index)
                  )}
                >
                  {crime}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-sm">
            {report.description}
          </p>

          {/* Location Section */}
          <div className="relative">
            <div
              className="flex items-start space-x-2 cursor-pointer group/location p-2 -m-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                setShowFullLocation(!showFullLocation);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setShowFullLocation(!showFullLocation);
                }
              }}
            >
              <LocationIcon reportId={report.id} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate group-hover/location:text-gray-900 dark:group-hover/location:text-gray-100 transition-colors">
                  {report.location}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Click to view full address
                </p>
              </div>
            </div>

            {/* Full Location Popup */}
            {showFullLocation && (
              <div className="absolute top-full left-0 z-50 mt-2 w-full max-w-xs sm:max-w-sm">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl p-4">
                  <div className="flex items-start justify-between space-x-2">
                    <div className="flex items-start space-x-2 flex-1">
                      <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-900 dark:text-gray-100 break-words">
                        {report.location}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFullLocation(false);
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>
              {format(new Date(report.created_at), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-100 dark:border-gray-700">
            <VoteButtons
              reportid={report.id}
              userid="00000000-0000-0000-0000-000000000000"
            />
            <div className="w-fit">
              <ShareButton reportId={report.id} />
            </div>
          </div>
          <div>
            <CommentSection reportId={report.id} />
          </div>
        </div>
      </Link>
    </div>
  );
}
