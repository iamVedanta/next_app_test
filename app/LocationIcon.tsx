// app/components/LocationIcon.tsx
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { supabase } from "@/lib/supabase";

interface LocationIconProps {
  reportId: string | number;
}

const LocationIcon: React.FC<LocationIconProps> = ({ reportId }) => {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("CrimeDB")
        .select("latt, long")
        .eq("id", reportId)
        .single();

      if (error) {
        setError("Failed to fetch location");
        setLoading(false);
        console.error(error);
        return;
      }

      if (data) {
        setLat(data.latt);
        setLng(data.long);
      }
      setLoading(false);
    };

    fetchCoordinates();
  }, [reportId]);

  const openInGoogleMaps = () => {
    if (lat !== null && lng !== null) {
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return <div title="Loading location...">⌛</div>;
  }

  if (error || lat === null || lng === null) {
    return (
      <div
        title="Location not available"
        className="text-gray-400 cursor-not-allowed"
      >
        <FaMapMarkerAlt />
      </div>
    );
  }

  return (
    <button
      onClick={openInGoogleMaps}
      title="Open location in Google Maps"
      aria-label="Open location in Google Maps"
      className="text-red-600 hover:text-red-800 focus:outline-none"
      style={{
        cursor: "pointer",
        background: "none",
        border: "none",
        padding: 0,
      }}
    >
      <FaMapMarkerAlt size={20} />
    </button>
  );
};

export default LocationIcon;
