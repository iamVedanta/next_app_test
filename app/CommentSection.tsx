import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

type Props = {
  reportId: string | number;
};

interface Comment {
  comment_id: string;
  comment: string;
  created_at?: string;
}

const CommentSection: React.FC<Props> = ({ reportId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("commentDB")
        .select("comment_id, comment, created_at")
        .eq("report_id", reportId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching comments:", error);
      } else {
        setComments(data || []);
      }
    };

    fetchComments();
  }, [reportId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const commentId = uuidv4();

    const { error } = await supabase.from("commentDB").insert({
      comment_id: commentId,
      report_id: reportId,
      comment: newComment.trim(),
    });

    if (error) {
      console.error("Error adding comment:", error);
    } else {
      setComments((prev) => [
        ...prev,
        { comment_id: commentId, comment: newComment.trim() },
      ]);
      setNewComment("");
    }
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3>Comments</h3>
      <div>
        {comments.map((comment) => (
          <div
            key={comment.comment_id}
            style={{
              backgroundColor: "#f1f1f1",
              padding: "8px",
              marginBottom: "6px",
              borderRadius: "4px",
            }}
          >
            {comment.comment}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "1rem" }}>
        <textarea
          rows={3}
          style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button
          onClick={handleAddComment}
          style={{
            marginTop: "0.5rem",
            backgroundColor: "#27ae60",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
