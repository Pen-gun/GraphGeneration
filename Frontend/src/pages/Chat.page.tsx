import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/search/search.component';
import { ResultDisplay } from '../components/result/result.component';
import { Sidebar } from '../components/sidebar/sidebar.component';
import { useCreateConversation, useGetConversations, useGetConversationById, useAddMessageToConversation } from '../hooks/conversation.hook';
import { useAIResponse } from '../hooks/aiHandler.hook';
import { useToast } from '../hooks/useToast.hook';
import type { ChatMessage } from '../types/types';
import { useAuth } from '../context/AuthContext';

const Chat: React.FC = () => {
    const { conversationId: paramConversationId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentQuery, setCurrentQuery] = useState<string>('');
    const [activeConversationId, setActiveConversationId] = useState<string | undefined>(paramConversationId);

    const { isAuthenticated } = useAuth();
    const { data: conversationsData } = useGetConversations(!!isAuthenticated);
    // Use activeConversationId instead of paramConversationId to stay in sync
    const { data: conversationDetailData } = useGetConversationById(activeConversationId, !!isAuthenticated && !!activeConversationId);
    const { mutate: addMessage, isPending, isError } = useAddMessageToConversation();
    const { mutate: createConversation } = useCreateConversation();
    const { mutate: generateAI, data: aiData } = useAIResponse();
    const toast = useToast();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Sync activeConversationId with URL param when it changes
    useEffect(() => {
        if (paramConversationId) {
            setActiveConversationId(paramConversationId);
        }
    }, [paramConversationId]);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isPending]);

    // Load conversation details and map to UI messages (user+assistant pairs)
    useEffect(() => {
        const conv = conversationDetailData?.data;
        if (conv?.messages) {
            const pairs: ChatMessage[] = [];
            for (let i = 0; i < conv.messages.length; i++) {
                const msg = conv.messages[i];
                if (msg.role === 'user') {
                    const next = conv.messages[i + 1];
                    const item: ChatMessage = {
                        id: msg._id,
                        query: msg.topic || '',
                        timestamp: new Date(msg.createdAt),
                    };
                    if (next && next.role === 'assistant') {
                        item.response = {
                            points: next.points,
                            diagram: next.diagram,
                            reasoning: undefined,
                        };
                        i++; // skip assistant in next loop iteration
                    }
                    pairs.push(item);
                }
            }
            setMessages(pairs);
        }
    }, [conversationDetailData]);

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

    // Guest mode: update messages when AI data arrives
    useEffect(() => {
        if (!isAuthenticated && aiData && currentQuery) {
            setMessages((prev) => {
                const updated = [...prev];
                const lastMsg = updated[updated.length - 1];
                if (lastMsg && !lastMsg.response) {
                    lastMsg.response = aiData;
                }
                return updated;
            });
            setCurrentQuery('');
        }
    }, [aiData, currentQuery, isAuthenticated]);

    const handleSearch = (query: string) => {
        if (!isAuthenticated) {
            // Guest mode: do not hit protected endpoints; call AI directly
            const userMsg: ChatMessage = {
                id: `msg-${Date.now()}`,
                query,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMsg]);
            setCurrentQuery(query);
            generateAI(query, {
                onError: () => toast.error('Failed to generate response')
            });
            return;
        }

        const sendToConversation = (convId: string) => {
            // Update local state immediately so subsequent queries use this ID
            setActiveConversationId(convId);
            
            // Optimistic UI: push user question
            const userMsg: ChatMessage = {
                id: `msg-${Date.now()}`,
                query,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMsg]);
            setCurrentQuery(query);

            addMessage(
                { conversationId: convId, payload: { topic: query } },
                {
                    onSuccess: (data: any) => {
                        // Optimistic: immediately show response
                        const assistantMsg = data?.data?.assistantMessage;
                        if (assistantMsg) {
                            setMessages((prev) => {
                                const updated = [...prev];
                                const lastMsg = updated[updated.length - 1];
                                if (lastMsg && !lastMsg.response) {
                                    lastMsg.response = {
                                        points: assistantMsg.points,
                                        diagram: assistantMsg.diagram,
                                        reasoning: undefined,
                                    };
                                }
                                return updated;
                            });
                        }
                        setCurrentQuery('');
                    },
                    onError: (error: any) => {
                        const errorMsg = error?.response?.data?.message || 'Failed to send message';
                        toast.error(errorMsg);
                    },
                }
            );
        };

        if (activeConversationId) {
            // Append to existing conversation
            sendToConversation(activeConversationId);
        } else {
            // Create a new conversation from first query
            createConversation(
                { title: query.slice(0, 60) },
                {
                    onSuccess: (res: any) => {
                        // Handle both response structures: res.data or res._id directly
                        const conv = res?.data?._id ? res.data : (res?._id ? res : null);
                        const convId = conv?._id || res?._id || res?.data?._id;
                        
                        if (convId) {
                            // Send message to the new conversation
                            sendToConversation(convId);
                            // Update URL after
                            navigate(`/chat/${convId}`);
                        } else {
                            console.error('Conversation response structure:', res);
                            toast.error('Failed to create conversation');
                        }
                    },
                    onError: (error: any) => {
                        console.log('Create conversation error:', error);
                    },
                }
            );
        }
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
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} activeConversationId={activeConversationId} />

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
                            placeholder={'Enter a topic to generate a graph...'}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
