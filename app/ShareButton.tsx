"use client";

import { useState } from "react";
import { FaShareAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonProps {
  reportId: string;
}

export default function ShareButton({ reportId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
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
    <motion.button
      onClick={handleShare}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center text-sm px-3 py-1.5 bg-blue-500 text-white rounded-full font-medium transition-colors duration-200 hover:bg-blue-600 focus:outline-none shadow-md"
      title="Share"
    >
      <FaShareAlt className="mr-2" />
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            Link Copied!
          </motion.span>
        ) : (
          <motion.span
            key="share"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            Share
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
