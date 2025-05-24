import { FaFilter } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dispatch, SetStateAction } from "react";

interface FiltersProps {
  selectedRatingRange: string;
  setSelectedRatingRange: Dispatch<SetStateAction<string>>;
  selectedDateRangeOption: string;
  setSelectedDateRangeOption: Dispatch<SetStateAction<string>>;
  dateRange: [Date | null, Date | null];
  setDateRange: Dispatch<SetStateAction<[Date | null, Date | null]>>;
}

export default function Filters({
  selectedRatingRange,
  setSelectedRatingRange,
  selectedDateRangeOption,
  setSelectedDateRangeOption,
  dateRange,
  setDateRange,
}: FiltersProps) {
  const [startDate, endDate] = dateRange;

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
    setSelectedDateRangeOption("range");
  };

  return (
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
            onChange={handleDateRangeChange}
            isClearable={true}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select Date Range"
            className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-none focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg p-2 text-sm"
          />
        </div>
      )}
    </div>
  );
}
