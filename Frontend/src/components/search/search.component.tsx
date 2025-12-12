import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
    onSearch, 
    placeholder = 'Search...' 
}) => {
    const [query, setQuery] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <div className="flex justify-center items-start pt-50 min-h-screen w-full">
            <form
                className="w-full max-w-3xl px-4"
                onSubmit={handleSubmit}
            >
                <div className="relative">
                    <div className="text-2xl font-bold mb-4 text-center">
                        Softech AI
                    </div>
                    <input
                        className="w-full  px-6 py-3 text-lg bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent shadow-2xl transition-all"
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder={placeholder}
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-3/4 -translate-y-1/2 p-4 rounded-full text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};