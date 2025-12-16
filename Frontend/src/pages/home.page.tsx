import { useState, useEffect, useRef } from "react";
import { SearchBar } from "../components/search/search.component.tsx";
import { ResultDisplay } from "../components/result/result.component.tsx";
import { useAIResponse } from "../hooks/aiHandler.hook.tsx";

interface ChatMessage {
    id: string;
    query: string;
    response?: {
        points: string | string[];
        diagram: string;
        reasoning?: string;
    };
    timestamp: Date;
}

const homePage = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentQuery, setCurrentQuery] = useState<string>('');
    const { mutate, data, isPending, isError } = useAIResponse();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isPending]);

    // Update messages when data arrives
    useEffect(() => {
        if (data && currentQuery) {
            setMessages(prev => {
                const updated = [...prev];
                const lastMsg = updated[updated.length - 1];
                if (lastMsg && !lastMsg.response) {
                    lastMsg.response = data;
                }
                return updated;
            });
            setCurrentQuery('');
        }
    }, [data]);

    const handleSearch = (query: string) => {
        // Add user message immediately
        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            query,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage]);
        setCurrentQuery(query);

        mutate(query, {
            onError: (error) => {
                console.error("Error fetching AI response:", error);
            }
        });
    };

    if (isError) {
        return <div>Error loading data.</div>
    };

    return (
            <div className="min-h-screen w-full flex flex-col">
                {/* Chat Messages Area */}
                <div className="flex flex-col overflow-y-auto pb-48 pt-8">

                    {messages.map((message, index) => (
                        <div key={message.id} className="w-full px-4 mb-8">
                            {/* User Query */}
                            <div className="max-w-6xl mx-auto mb-6">
                                <div className="bg-purple-600/20 border border-purple-500/30 rounded-2xl p-4 ml-auto w-fit">
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
                                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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

                {/* Fixed Search Bar at Bottom */}
                <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent pb-4 pt-8 z-50">
                    <SearchBar
                        onSearch={handleSearch}
                        hasResults={messages.length > 0}
                        placeholder="Enter a topic to generate a graph..."
                        
                    />
                </div>
            </div>
    );
}
export default homePage;