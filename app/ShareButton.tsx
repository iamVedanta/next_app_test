"use client";

import { useState } from "react";
import { FaShareAlt } from "react-icons/fa";

interface ShareButtonProps {
  reportId: string;
}

export default function ShareButton({ reportId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined"
    ? `${window.location.origin}/reports/${reportId}`
    : "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this report",
          url,
        });
      } catch (err) {
        console.error("Sharing failed", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy", err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      title="Share"
    >
      <FaShareAlt className="mr-1" />
      {copied ? "Link Copied!" : "Share"}
    </button>
  );
}
