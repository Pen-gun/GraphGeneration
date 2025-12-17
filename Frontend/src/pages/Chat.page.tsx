import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { SearchBar } from '../components/search/search.component';
import { ResultDisplay } from '../components/result/result.component';
import { Sidebar } from '../components/sidebar/sidebar.component';
import { useAIResponse } from '../hooks/aiHandler.hook';
import { useCreateQuery, useGetQueries } from '../hooks/query.hook';
import { useToast } from '../hooks/useToast.hook';
import type { ChatMessage } from '../types/types';
import { useAuth } from '../context/AuthContext';

const Chat: React.FC = () => {
    const { conversationId } = useParams();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentQuery, setCurrentQuery] = useState<string>('');

    const { mutate: generateAI, data: aiData, isPending, isError } = useAIResponse();
    const { mutate: createQuery } = useCreateQuery();
    const { isAuthenticated } = useAuth();
    const { data: queriesData } = useGetQueries(!!isAuthenticated);
    const toast = useToast();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isPending]);

    // Load conversation if conversationId exists; do NOT auto clear when it doesn't
    useEffect(() => {
        if (conversationId && queriesData?.data) {
            const conversation = queriesData.data.find((q: any) => q._id === conversationId);
            if (conversation) {
                const loadedMessage: ChatMessage = {
                    id: conversation._id,
                    query: conversation.topic,
                    response: {
                        points: conversation.points,
                        diagram: conversation.diagram,
                    },
                    timestamp: new Date(conversation.createdAt),
                };
                setMessages([loadedMessage]);
            }
        }
    }, [conversationId, queriesData]);

    // Clear messages only on explicit newChat navigation state
    useEffect(() => {
        const state = (location as any).state as { newChat?: boolean } | null;
        if (state?.newChat) {
            setMessages([]);
            // Remove the state to avoid repeated clears
            try {
                window.history.replaceState({}, document.title, location.pathname);
            } catch {}
        }
    }, [location]);

    // Update messages when AI data arrives
    useEffect(() => {
        if (aiData && currentQuery) {
            setMessages((prev) => {
                const updated = [...prev];
                const lastMsg = updated[updated.length - 1];
                if (lastMsg && !lastMsg.response) {
                    lastMsg.response = aiData;

                    // Save to backend only when authenticated
                    if (isAuthenticated) {
                        createQuery(
                            {
                                topic: lastMsg.query,
                                points: Array.isArray(aiData.points)
                                    ? aiData.points
                                    : aiData.points.split('\n').filter((p: string) => p.trim()),
                                diagram: aiData.diagram,
                            },
                            {
                                onSuccess: () => {
                                    toast.success('Conversation saved');
                                },
                                onError: () => {
                                    toast.error('Failed to save conversation');
                                },
                            }
                        );
                    }
                }
                return updated;
            });
            setCurrentQuery('');
        }
    }, [aiData, currentQuery, createQuery, toast]);

    const handleSearch = (query: string) => {
        // Don't allow new queries if viewing a saved conversation
        if (conversationId) {
            toast.warning('Create a new chat to ask another question');
            return;
        }

        // Add user message immediately
        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            query,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
        setCurrentQuery(query);

        generateAI(query, {
            onError: (error) => {
                console.error('Error fetching AI response:', error);
                toast.error('Failed to generate response');
            },
        });
    };

    if (isError) {
        return (
            <div className="flex h-screen bg-slate-900">
                <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-400 text-lg">Error loading data.</p>
                        <p className="text-gray-400 mt-2">Please try again later.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-900 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative">
                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto pb-32 pt-8">
                    {messages.length === 0 ? (
                        <div className="max-w-3xl mx-auto px-4">
                            {!isAuthenticated && (
                                <div className="mb-4 text-center text-gray-300 text-sm">
                                    You’re in guest mode — <Link to="/login" className="text-purple-400 hover:text-purple-300 underline">sign in</Link> to save chats.
                                </div>
                            )}
                            <SearchBar
                                onSearch={handleSearch}
                                hasResults={false}
                                placeholder="Enter a topic to generate a graph..."
                            />
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {messages.map((message, index) => (
                                <div key={message.id} className="w-full px-4">
                                    {/* User Query */}
                                    <div className="max-w-6xl mx-auto mb-6">
                                        <div className="bg-purple-600/20 border border-purple-500/30 rounded-2xl p-4 ml-auto w-fit max-w-[80%]">
                                            <p className="text-white text-lg">{message.query}</p>
                                        </div>
                                    </div>

                                    {/* AI Response */}
                                    {message.response && (
                                        <div className="max-w-6xl mx-auto">
                                            <ResultDisplay
                                                points={message.response.points}
                                                diagram={message.response.diagram}
                                                reasoning={message.response.reasoning}
                                            />
                                        </div>
                                    )}

                                    {/* Loading indicator for last message */}
                                    {!message.response && index === messages.length - 1 && isPending && (
                                        <div className="max-w-6xl mx-auto">
                                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex gap-1">
                                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                    </div>
                                                    <span className="text-gray-300">Generating insights...</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Fixed Search Bar at Bottom */}
                {messages.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent pb-4 pt-8 z-10">
                        {!isAuthenticated && (
                            <div className="max-w-3xl mx-auto px-4 mb-2 text-center text-gray-400 text-xs">
                                Sign in to save this conversation.
                            </div>
                        )}
                        <SearchBar
                            onSearch={handleSearch}
                            hasResults={true}
                            placeholder={
                                conversationId
                                    ? 'Start a new chat to ask another question...'
                                    : 'Enter a topic to generate a graph...'
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
