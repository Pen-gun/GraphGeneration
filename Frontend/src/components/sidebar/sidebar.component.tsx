import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, LogOut, User, Menu, X, Sparkles } from 'lucide-react';
import { useGetQueries, useDeleteQuery } from '../../hooks/query.hook';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast.hook';
import { ConversationItem } from './ConversationItem';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
    const navigate = useNavigate();
    const { conversationId } = useParams();
    const { user, logout, isAuthenticated } = useAuth();
    const { data: queriesData, isLoading } = useGetQueries(!!isAuthenticated);
    const deleteMutation = useDeleteQuery();
    const toast = useToast();

    const queries = queriesData?.data || [];

    const handleNewChat = () => {
        navigate('/');
        onToggle();
    };

    const handleConversationClick = (id: string) => {
        navigate(`/chat/${id}`);
        if (window.innerWidth < 768) {
            onToggle();
        }
    };

    const handleDeleteConversation = (id: string) => {
        deleteMutation.mutate(id, {
            onSuccess: () => {
                toast.success('Conversation deleted');
                if (conversationId === id) {
                    navigate('/');
                }
            },
            onError: () => {
                toast.error('Failed to delete conversation');
            },
        });
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            navigate('/');
            window.location.reload();
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={onToggle}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed md:sticky top-0 left-0 h-screen w-[280px] bg-slate-900/95 backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Softech AI
                        </h1>
                    </div>

                    {/* New Chat Button */}
                    <button
                        onClick={handleNewChat}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        New Chat
                    </button>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {!isAuthenticated ? (
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">Sign in to view your saved chats</p>
                        </div>
                    ) : isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                        </div>
                    ) : queries.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">No conversations yet</p>
                            <p className="text-xs mt-1">Start a new chat to begin</p>
                        </div>
                    ) : (
                        queries.map((query: any) => (
                            <ConversationItem
                                key={query._id}
                                query={query}
                                isActive={conversationId === query._id}
                                onClick={() => handleConversationClick(query._id)}
                                onDelete={handleDeleteConversation}
                            />
                        ))
                    )}
                </div>


                {/* User Section / Guest CTAs */}
                {isAuthenticated ? (
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.fullName || 'User'}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    @{user?.username}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={() => navigate('/profile')}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-lg transition-all"
                            >
                                <User className="w-4 h-4" />
                                Profile
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-lg transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 border-t border-white/10">
                        <div className="space-y-2">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-lg transition-all"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all"
                            >
                                Create account
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
