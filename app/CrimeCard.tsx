import { FaMapMarkerAlt, FaShareAlt, FaCommentDots } from "react-icons/fa";

type CrimeReport = {
  id: string;
  description: string;
  location: string;
  tags: string[];
  rating: number;
  created_at: string;
  crimes: string[];
};

interface CrimeCardProps {
  report: CrimeReport;
  expandedDescription: string | null;
  onCardClick: (id: string) => void;
  onShare: (id: string) => void;
  onComment: (id: string) => void;
  getBorderColor: (rating: number) => string;
  getBackgroundColor: (rating: number) => string;
}

export default function CrimeCard({
  report,
  expandedDescription,
  onCardClick,
  onShare,
  onComment,
  getBorderColor,
  getBackgroundColor,
}: CrimeCardProps) {
  const isLong = report.description.length > 150;
  const description =
    expandedDescription === report.id
      ? report.description
      : report.description.slice(0, 150) + (isLong ? "..." : "");

  return (
    <div
      onClick={() => onCardClick(report.id)}
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
        {new Date(report.created_at).toLocaleString()}
      </p>

      <div className="flex justify-end space-x-4 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShare(report.id);
          }}
          className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 text-sm font-medium"
        >
          <FaShareAlt />
          <span>Share</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComment(report.id);
          }}
          className="flex items-center space-x-1 text-green-600 hover:text-green-800 text-sm font-medium"
        >
          <FaCommentDots />
          <span>Comment</span>
        </button>
      </div>
    </div>
  );
}
