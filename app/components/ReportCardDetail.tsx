// app/components/ReportCardDetail.tsx
import { format } from "date-fns";
import { FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link"; // Import Link for navigation
import UpvoteButton from "../Upvotebutton";
import Downvotebutton from "../Downvotebutton";
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
          {/* This component will now primarily show the full description,
              as its purpose is often for the detail page or a card that
              links to a detail. For truncation in the list, we'll handle it
              in the parent (app/page.tsx) directly before passing the prop. */}
          {report.description}
        </p>

        <div className="flex justify-between items-center mt-2 text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-gray-500 dark:text-gray-300 mr-1" />
            <p>{report.location}</p>
          </div>
          <div className="text-right mt-2 md:mt-0">
            <span className="font-semibold">Safety Rating: </span>
            <span className="text-gray-700 dark:text-gray-200">
              {report.rating}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {format(new Date(report.created_at), "d MMMM yyyy, h:mm a")}
        </p>
      </Link>
      <div className="flex justify-end space-x-4 mt-2">
        <UpvoteButton id={report.id} />

        <Downvotebutton id={report.id} />
      </div>
    </div>
  );
}
