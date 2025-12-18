// User Types
export interface User {
    _id: string;
    username: string;
    fullName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginCredentials {
    email?: string;
    username?: string;
    password: string;
}

export interface RegisterData {
    username: string;
    fullName: string;
    email: string;
    password: string;
}

// Query/Conversation Types
export interface Query {
    _id: string;
    owner: string;
    topic: string;
    points: string[];
    diagram: string;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    _id: string;
    conversationId: string;
    owner: string;
    topic?: string;
    points: string[];
    diagram: string;
    role: 'user' | 'assistant';
    createdAt: string;
    updatedAt: string;
}

export interface ConversationMeta {
    _id: string;
    owner: string;
    title: string;
    lastMessage: string;
    createdAt: string;
    updatedAt: string;
}

export interface ConversationDetail extends ConversationMeta {
    messages: Message[];
}

export interface ChatMessage {
    id: string;
    query: string;
    response?: {
        points: string | string[];
        diagram: string;
        reasoning?: string;
    };
    timestamp: Date;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        user: User;
    };
    message?: string;
}

// Toast Types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}
