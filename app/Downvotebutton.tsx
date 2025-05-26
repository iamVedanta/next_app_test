import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
        // Safe insert or update (no conflict)
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
    <button
      onClick={handleDownvote}
      style={{
        backgroundColor: "#e74c3c",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px",
        userSelect: "none",
        transition: "background-color 0.3s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
          "#c0392b";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
          "#e74c3c";
      }}
      aria-label={`Downvote button. Current count: ${downvote}`}
    >
      👎 Downvote ({downvote})
    </button>
  );
};

export default Downvotebutton;
