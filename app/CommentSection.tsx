import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import Comment from "./Comment";
import { supabase } from "@/lib/supabase"; // Adjust the import path as necessary
interface CommentData {
  comment_id: string;
  report_id: string;
  user_id: string;
  comment: string;
  created_at?: string;
}

interface CommentSectionProps {
  reportId: string;
  initialComments?: CommentData[];
}

export default function CommentSection({
  reportId,
  initialComments = [],
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddComment = async () => {
    const trimmedComment = newComment.trim();
    if (!trimmedComment) return;

    const newCommentData: Omit<CommentData, "comment_id"> = {
      report_id: reportId,
      user_id: "00000000-0000-0000-0000-000000000000", // Replace with actual user ID
      comment: trimmedComment,
    };

    try {
      const { data, error } = await supabase
        .from("commentDB")
        .insert([newCommentData])
        .select()
        .single();

      if (error) throw error;

      const createdComment: CommentData = {
        ...data,
        comment_id: data.comment_id,
        created_at: data.created_at,
      };

      setComments((prev) => [createdComment, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment to Supabase:", error);
      // Optionally show an error message to the user
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
      {/* Comments Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-3"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm font-medium">
          Comments ({comments.length})
        </span>
      </button>

      {isExpanded && (
        <div className="space-y-4">
          {/* Add Comment Form */}
          <div className="space-y-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a comment..."
              className="min-h-[80px] resize-none"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Post Comment</span>
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <Comment key={comment.comment_id} comment={comment} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
