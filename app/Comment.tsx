import { format } from "date-fns";
import { User } from "lucide-react";

interface CommentData {
  comment_id: string;
  report_id: string;
  user_id: string;
  comment: string;
  created_at?: string;
}

interface CommentProps {
  comment: CommentData;
}

export default function Comment({ comment }: CommentProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
      {/* User Info */}
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-gradient-to-br from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center">
          <User className="w-3 h-3 text-white" />
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-medium text-gray-800 dark:text-gray-200">
            Anonymous User
          </span>
          {comment.created_at && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 dark:text-gray-400">
                {format(new Date(comment.created_at), "MMM d, h:mm a")}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Comment Text */}
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {comment.comment}
      </p>
    </div>
  );
}
