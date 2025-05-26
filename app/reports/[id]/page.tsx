"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import "../../globals.css"; // Ensure global styles are imported
import ReportCardDetail from "../../components/ReportCardDetail";

interface Report {
  id: string;
  description: string;
  location: string;
  tags: string[]; // you can map this from 'category' or 'crimes'
  rating: number;
  created_at: string;
  crimes: string[];
}

export default function ReportPage() {
  const params = useParams();
  const postId = params.id;
  const [reportData, setReportData] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const fetchReportData = async () => {
      const { data, error } = await supabase
        .from("CrimeDB")
        .select("*")
        .eq("id", postId)
        .single(); // fetch a single row directly

      if (error) {
        console.error("Error fetching report data:", error);
        setLoading(false);
        return;
      }

      if (data) {
        const formattedReport: Report = {
          id: String(data.id),
          description: data.description,
          location: data.location,
          tags: [data.category], // wrap category as a tag
          rating: data.rating,
          created_at: data.created_at,
          crimes: data.crimes ? data.crimes : [data.category], // fallback
        };

        setReportData(formattedReport);
      }

      setLoading(false);
    };

    fetchReportData();
  }, [postId]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {loading ? (
        <p>Loading report data...</p>
      ) : reportData ? (
        <ReportCardDetail report={reportData} />
      ) : (
        <p>No report found for ID: {postId}</p>
      )}
    </div>
  );
}
