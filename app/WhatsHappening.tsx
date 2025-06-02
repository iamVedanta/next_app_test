// app/components/WhatsHappening.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Ensure this path is correct
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"; // Adjust path as needed
import { Badge } from "@/app/components/ui/badge"; // Adjust path as needed
import { Button } from "@/app/components/ui/button"; // Adjust path as needed
import { ScrollArea } from "@/app/components/ui/scroll-area"; // Adjust path as needed

// Lucide React icons
import { MapPin, Star, Clock, ChevronDown, BellRing } from "lucide-react"; // Added BellRing for a "news/alert" feel

// You'll need to configure your fonts in your Tailwind CSS config or global CSS
// For example, in tailwind.config.js:
// theme: {
//   extend: {
//     fontFamily: {
//       sans: ['Inter', 'sans-serif'], // Or define as a variable if using @next/font/google
//       heading: ['Montserrat', 'sans-serif'], // Example for a distinct heading font
//     },
//   },
// },

type CrimeReport = {
  id: string;
  location: string;
  description: string;
  rating: number;
  created_at: string;
};

function extractCity(location: string) {
  if (!location) return "Unknown Location";
  const parts = location.split(",");
  if (parts.length >= 2) return parts[1].trim();
  return location;
}

interface WhatsHappeningProps {
  className?: string;
}

export default function WhatsHappening({
  className = "",
}: WhatsHappeningProps) {
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(5);
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("CrimeDB")
        .select("id, location, description, rating, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching reports:", error);
        setReports([]);
      } else {
        setReports(data as CrimeReport[]);
      }
      setLoading(false);
    };
    fetchReports();
  }, [limit]);

  const handlePostClick = (id: string) => {
    router.push(`/reports/${id}`);
  };

  const showMore = () => {
    setExpanded(true);
    setLimit((prev) => prev + 5);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // const getRatingColor = (rating: number) => {
  //   if (rating >= 7) return "text-green-700 bg-green-100 border-green-300"; // High Risk - Slightly darker text, lighter background
  //   if (rating >= 4) return "text-yellow-700 bg-yellow-100 border-yellow-300"; // Medium Risk
  //   return "text-red-700 bg-red-100 border-red-300"; // Low Risk - Assuming lower rating means higher risk/severity here based on color
  // };

  return (
    <Card className={`w-full max-w-md h-[600px] flex flex-col ${className}`}>
      <CardHeader className="flex-shrink-0 pb-4 border-b border-border/60">
        {" "}
        {/* Added a subtle border */}
        <CardTitle className="flex items-center text-2xl font-heading text-gray-800">
          {" "}
          {/* Using font-heading, larger text */}
          <BellRing className="h-6 w-6 mr-3 text-blue-600 animate-pulse" />{" "}
          {/* Thematic icon with subtle animation */}
          What&apos;s Happening
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden font-sans">
        {" "}
        {/* Applied font-sans */}
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>{" "}
              {/* Slightly larger spinner */}
              <p className="text-base text-muted-foreground">
                Loading reports...
              </p>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto text-blue-400" />{" "}
              {/* Larger, colored icon */}
              <p className="text-lg text-muted-foreground">
                No recent reports found.
              </p>{" "}
              {/* More descriptive text */}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <ScrollArea
              className={`flex-1 px-6 ${expanded ? "pb-4" : "pb-16"}`}
            >
              <div className="space-y-4 pt-4">
                {" "}
                {/* Added some top padding */}
                {reports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => handlePostClick(report.id)}
                    className="group cursor-pointer p-4 rounded-xl border border-gray-200 
                               hover:border-blue-300 hover:shadow-lg hover:bg-blue-50/50
                               transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]
                               transform-gpu" // Added transform-gpu for smoother animations
                  >
                    <div className="space-y-3">
                      <p className="text-base font-medium leading-relaxed line-clamp-3 text-gray-700 group-hover:text-blue-800">
                        {report.description}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <span className="truncate max-w-[160px] font-semibold">
                            {extractCity(report.location)}
                          </span>
                        </div>
                        <Badge
                          className={`text-sm font-bold px-3 py-1 rounded-full flex items-center space-x-1`}
                        >
                          {/* 
                          <Badge
                          className={`text-sm font-bold px-3 py-1 rounded-full flex items-center space-x-1 ${getRatingColor(
                            report.rating
                          )}`}
                        ></Badge> */}
                          <div className="flex items-center space-x-0.5">
                            {[...Array(5)].map((_, index) => (
                              <Star
                                key={index}
                                className={`h-4 w-4 ${
                                  report.rating / 2 > index
                                    ? "fill-current text-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </Badge>
                      </div>

                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        <span>{formatDate(report.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {!expanded && reports.length >= 5 && (
              <div className="relative flex-shrink-0">
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-transparent to-white pointer-events-none" />{" "}
                {/* Adjusted gradient height and color to match background */}
                <div className="px-6 py-4 bg-white">
                  {" "}
                  {/* Assuming white background */}
                  <Button
                    onClick={showMore}
                    variant="outline"
                    size="lg" // Slightly larger button
                    className="w-full text-blue-600 border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                  >
                    <ChevronDown className="h-5 w-5 mr-2" />{" "}
                    {/* Slightly larger icon */}
                    Show More Reports
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
