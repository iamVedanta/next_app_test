"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type Props = {
  reportid: number | string;
  userid: string;
};

export default function VoteButtons({ reportid, userid }: Props) {
  const [voteStatus, setVoteStatus] = useState<null | number>(null);
  const [loading, setLoading] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);

  useEffect(() => {
    if (!reportid || !userid) return;

    const fetchUserVote = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("LikesDB")
          .select("vote", { head: false }) // ensures it expects JSON
          .eq("post_id", reportid)
          .eq("user_id", userid)
          .maybeSingle(); // prevents 404 errors

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (data) {
          console.log("User vote fetched:", data.vote);
          setVoteStatus(data.vote);
        }
      } catch (error) {
        console.error("Error fetching user vote:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchVoteCounts = async () => {
      try {
        const { data, error } = await supabase
          .from("CrimeDB")
          .select("upvotes, downvotes")
          .eq("id", reportid)
          .single();

        if (error) throw error;

        console.log("Fetched upvotes/downvotes:", data);
        setUpvotes(data?.upvotes ?? 0);
        setDownvotes(data?.downvotes ?? 0);
      } catch (error) {
        console.error("Error fetching vote counts:", error);
      }
    };

    fetchUserVote();
    fetchVoteCounts();
  }, [reportid, userid]);

  const handleVote = async (newVote: number) => {
    if (loading) return;
    setLoading(true);

    try {
      const { data: existingVoteData, error: fetchError } = await supabase
        .from("LikesDB")
        .select("vote")
        .eq("post_id", reportid)
        .eq("user_id", userid)
        .maybeSingle(); // <— Changed from .single() to .maybeSingle()

      if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

      const existingVote = existingVoteData ? existingVoteData.vote : null;
      let upvoteChange = 0;
      let downvoteChange = 0;

      if (existingVote === null) {
        await supabase
          .from("LikesDB")
          .insert([{ post_id: reportid, user_id: userid, vote: newVote }]);

        if (newVote === 1) {
          upvoteChange++;
        } else {
          downvoteChange++;
        }
      } else if (existingVote === newVote) {
        await supabase
          .from("LikesDB")
          .delete()
          .eq("post_id", reportid)
          .eq("user_id", userid);

        if (newVote === 1) {
          upvoteChange--;
        } else {
          downvoteChange--;
        }

        setVoteStatus(null);
      } else {
        await supabase
          .from("LikesDB")
          .update({ vote: newVote })
          .eq("post_id", reportid)
          .eq("user_id", userid);

        if (newVote === 1) {
          upvoteChange++;
          downvoteChange--;
        } else {
          upvoteChange--;
          downvoteChange++;
        }
      }

      const { data: crimeData, error: crimeError } = await supabase
        .from("CrimeDB")
        .select("upvotes, downvotes")
        .eq("id", reportid)
        .single();

      if (crimeError) throw crimeError;

      const updatedUpvotes = (crimeData?.upvotes ?? 0) + upvoteChange;
      const updatedDownvotes = (crimeData?.downvotes ?? 0) + downvoteChange;

      await supabase
        .from("CrimeDB")
        .update({ upvotes: updatedUpvotes, downvotes: updatedDownvotes })
        .eq("id", reportid);

      setUpvotes(updatedUpvotes);
      setDownvotes(updatedDownvotes);

      if (existingVote !== newVote || existingVote === null) {
        setVoteStatus(newVote);
      } else {
        setVoteStatus(null);
      }
    } catch (error) {
      console.error("Voting error:", error);
      alert("Failed to submit vote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={() => handleVote(1)}
        disabled={loading}
        className={cn(
          "inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
          voteStatus === 1
            ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
            : "bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400 dark:hover:bg-gray-600/50"
        )}
      >
        <ThumbsUp className="w-4 h-4" />
        <span>{upvotes}</span>
      </button>

      <button
        onClick={() => handleVote(-1)}
        disabled={loading}
        className={cn(
          "inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
          voteStatus === -1
            ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
            : "bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400 dark:hover:bg-gray-600/50"
        )}
      >
        <ThumbsDown className="w-4 h-4" />
        <span>{downvotes}</span>
      </button>
    </div>
  );
}
