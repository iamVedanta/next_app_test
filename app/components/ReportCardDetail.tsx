// app/components/ReportCardDetail.tsx
import { useState } from "react";
import { format } from "date-fns";
// import { FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link"; // Import Link for navigation
import UpvoteButton from "../Upvotebutton";
import Downvotebutton from "../Downvotebutton";
import ShareButton from "../ShareButton";
import LocationIcon from "../LocationIcon";

interface ReportCardDetailProps {
  report: {
    id: string;
    description: string;
    location: string;
    tags: string[];
    rating: number;
    created_at: string;
    crimes: string[];
  };
}

export default function ReportCardDetail({ report }: ReportCardDetailProps) {
  const [showFullLocation, setShowFullLocation] = useState(false);

  return (
    <div
      className={`p-5 rounded-xl shadow-md transition duration-300 ease-in-out border border-gray-200 dark:border-gray-600 hover:shadow-lg cursor-pointer bg-white dark:bg-gray-700`}
    >
      <Link href={`/reports/${report.id}`} passHref>
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
              className={`inline-block font-semibold bg-gray-500 text-white px-3 py-1 rounded-full text-xs mr-2`}
            >
              {tag}
            </span>
          ))}
        </div>

        <p
          className="text-base text-gray-800 dark:text-gray-100"
          style={{
            fontFamily: "Helvetica, sans-serif",
            fontSize: "14px",
          }}
        >
          {report.description}
        </p>

        <div className="flex justify-between items-center mt-2 text-gray-600 dark:text-gray-300 relative">
          {/* Clickable truncated location */}
          <div
            className="flex items-center max-w-[70%] cursor-pointer select-text"
            onClick={(e) => {
              e.preventDefault();
              setShowFullLocation(!showFullLocation);
            }}
            aria-label="Click to see full location"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowFullLocation(!showFullLocation);
              }
            }}
          >
            {/* <FaMapMarkerAlt className="text-gray-500 dark:text-gray-300 mr-1 flex-shrink-0" /> */}

            <LocationIcon reportId={report.id} />

            <p
              className="truncate"
              style={{ minWidth: 0, marginLeft: "0.5rem" }}
            >
              {report.location}
            </p>
          </div>

          <div className="text-right mt-2 md:mt-0">
            <span className="font-semibold">Safety Rating: </span>
            <span className="text-gray-700 dark:text-gray-200">
              {Math.abs(10 - report.rating) ? Math.abs(10 - report.rating) : 1}
            </span>
          </div>

          {/* Popup for full location */}
          {showFullLocation && (
            <div
              className="absolute top-full left-0 z-10 mt-1 w-max max-w-xs p-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded shadow-lg border border-gray-300 dark:border-gray-600 break-words"
              onClick={(e) => e.stopPropagation()} // prevent Link click
            >
              {report.location}
              <button
                className="ml-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullLocation(false);
                }}
                aria-label="Close full location popup"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {format(new Date(report.created_at), "d MMMM yyyy, h:mm a")}
        </p>
      </Link>

      <div className="flex justify-end space-x-4 mt-2">
        <UpvoteButton id={report.id} />

        <Downvotebutton id={report.id} />

        <ShareButton reportId={report.id} />
      </div>
    </div>
  );
}
