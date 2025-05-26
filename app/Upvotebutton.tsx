import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { FaThumbsUp } from "react-icons/fa";

interface UpvoteButtonProps {
  id: string | number;
}

const UpvoteButton: React.FC<UpvoteButtonProps> = ({ id }) => {
  const [upvote, setUpvotes] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUpvotes = async () => {
      const { data, error } = await supabase
        .from("likesDB")
        .select("upvote")
        .eq("id", id)
        .single();

      if (data) {
        setUpvotes(data.upvote);
      } else if (error && error.code !== "PGRST116") {
        console.error("Error fetching upvotes:", error);
      }

      setLoading(false);
    };

    fetchUpvotes();
  }, [id]);

  const handleUpvote = async () => {
    if (loading) return;
    const newUpvotes = upvote + 1;

    const { error } = await supabase
      .from("likesDB")
      .upsert({ id, upvote: newUpvotes }, { onConflict: "id" });

    if (error) {
      console.error("Error upvoting:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
    } else {
      setUpvotes(newUpvotes);
    }
  };

  return (
    <motion.button
      onClick={handleUpvote}
      disabled={loading}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: loading ? 1 : 1.05 }}
      className={`
        flex items-center justify-center gap-2
        bg-teal-600 text-white rounded-full shadow-md
        transition-colors duration-300 hover:bg-teal-700 focus:outline-none font-medium
        px-3 py-1 text-sm
        sm:px-4 sm:py-2 sm:text-base
        min-w-[80px]
        ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
      `}
      aria-label={`Upvote button. Current count: ${upvote}`}
      style={{ minWidth: "80px" }}
    >
      <FaThumbsUp size={16} />
      <span className="min-w-[24px] text-center tabular-nums">
        {loading ? "..." : upvote}
      </span>
    </motion.button>
  );
};

export default UpvoteButton;
