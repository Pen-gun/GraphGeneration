import React, { useState } from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import type { Query } from '../../types/types.ts';
import { Modal } from '../common/Modal';

interface ConversationItemProps {
    query: Query;
    isActive: boolean;
    onClick: () => void;
    onDelete: (id: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
    query,
    isActive,
    onClick,
    onDelete,
}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        onDelete(query._id);
        setShowDeleteModal(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);
        const diffInDays = diffInHours / 24;

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
        if (diffInDays < 7) return `${Math.floor(diffInDays)}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <>
            <div
                onClick={onClick}
                className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${isActive
                        ? 'bg-purple-500/20 border border-purple-500/30'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
            >
                <MessageSquare className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isActive ? 'text-purple-400' : 'text-gray-400'
                    }`} />

                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-gray-300'
                        }`}>
                        {query.topic}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {formatDate(query.createdAt)}
                    </p>
                </div>

                <button
                    onClick={handleDelete}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-lg transition-all flex-shrink-0"
                >
                    <Trash2 className="w-4 h-4 text-red-400" />
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Conversation"
                footer={
                    <>
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                            Delete
                        </button>
                    </>
                }
            >
                <p className="text-gray-300">
                    Are you sure you want to delete this conversation? This action cannot be undone.
                </p>
            </Modal>
        </>
    );
};
