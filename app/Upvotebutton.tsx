import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
    <button
      onClick={handleUpvote}
      disabled={loading}
      style={{
        backgroundColor: "#009688",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      👍 Upvote ({loading ? "..." : upvote})
    </button>
  );
};

export default UpvoteButton;
