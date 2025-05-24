import CrimeCard from "./CrimeCard";

type CrimeReport = {
  id: string;
  description: string;
  location: string;
  tags: string[];
  rating: number;
  created_at: string;
  crimes: string[];
};

interface CrimeListProps {
  reports: CrimeReport[];
  loading: boolean;
  expandedDescription: string | null;
  onCardClick: (id: string) => void;
  onShare: (id: string) => void;
  onComment: (id: string) => void;
  getBorderColor: (rating: number) => string;
  getBackgroundColor: (rating: number) => string;
}

export default function CrimeList({
  reports,
  loading,
  expandedDescription,
  onCardClick,
  onShare,
  onComment,
  getBorderColor,
  getBackgroundColor,
}: CrimeListProps) {
  if (loading)
    return (
      <div className="text-center text-teal-600 dark:text-teal-400 text-lg py-10">
        Loading...
      </div>
    );

  if (!loading && reports.length === 0)
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 text-lg py-10">
        No Crime Reports Found
      </div>
    );

  return (
    <div className="space-y-6">
      {reports.map((report) => (
        <CrimeCard
          key={report.id}
          report={report}
          expandedDescription={expandedDescription}
          onCardClick={onCardClick}
          onShare={onShare}
          onComment={onComment}
          getBorderColor={getBorderColor}
          getBackgroundColor={getBackgroundColor}
        />
      ))}
    </div>
  );
}
