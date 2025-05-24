import React from "react";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    comment: string,
    reportId: string | number
  ) => void | Promise<void>;
  reportId: string | number | null;
  commentText: string;
  setCommentText: React.Dispatch<React.SetStateAction<string>>;
}

const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  reportId,
  commentText,
  setCommentText,
}) => {
  if (!isOpen || reportId === null) return null;

  const handleClose = () => {
    onClose();
    setCommentText("");
  };

  const handleSubmit = async () => {
    await onSubmit(commentText, reportId);
    handleClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
          Leave a Comment
        </h2>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              handleSubmit();
            }
          }}
          className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          rows={4}
          placeholder="Write your comment..."
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
