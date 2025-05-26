import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { FaThumbsDown } from "react-icons/fa";

type Props = {
  id: string | number;
};

const Downvotebutton: React.FC<Props> = ({ id }) => {
  const [downvote, setDownvote] = useState(0);

  useEffect(() => {
    const fetchOrInitVotes = async () => {
      const { data, error } = await supabase
        .from("likesDB")
        .select("downvote")
        .eq("id", id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching downvotes:", error);
        return;
      }

      if (!data) {
        const { error: upsertError } = await supabase
          .from("likesDB")
          .upsert({ id, upvote: 0, downvote: 0 }, { onConflict: "id" });

        if (upsertError) {
          console.error("Error initializing votes:", upsertError);
        } else {
          setDownvote(0);
        }
      } else {
        setDownvote(data.downvote ?? 0);
      }
    };

    fetchOrInitVotes();
  }, [id]);

  const handleDownvote = async () => {
    const newDownvote = downvote + 1;

    const { error } = await supabase
      .from("likesDB")
      .upsert({ id, downvote: newDownvote }, { onConflict: "id" });

    if (error) {
      console.error("Error downvoting:", error);
    } else {
      setDownvote(newDownvote);
    }
  };

  return (
    <motion.button
      onClick={handleDownvote}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className="
        flex items-center justify-center gap-2
        bg-red-500 text-white rounded-full shadow-md
        transition-colors duration-300 hover:bg-red-600 focus:outline-none font-medium
        px-3 py-1 text-sm
        sm:px-4 sm:py-2 sm:text-base
        min-w-[80px]
      "
      aria-label={`Downvote button. Current count: ${downvote}`}
      style={{ minWidth: "80px" }}
    >
      <FaThumbsDown size={16} />
      <span className="min-w-[24px] text-center tabular-nums">{downvote}</span>
    </motion.button>
  );
};

export default Downvotebutton;
