import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    hasResults?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    placeholder = 'Search...',
    hasResults = false
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
        <div className={`flex justify-center w-full transition-all duration-500 ${hasResults
                ? 'fixed bottom-0 left-0 right-0 pb-4 z-50 backdrop-blur-sm'
                : 'pt-50 min-h-screen'
            }`}>
            <form
                className={`w-full px-4 transition-all duration-500 ${hasResults ? 'max-w-2xl' : 'max-w-4xl'
                    }`}
                onSubmit={handleSubmit}
            >
                <div className="relative">
                    {!hasResults && (
                        <div className="text-2xl font-bold mb-4 text-center">
                            Softech AI
                        </div>
                    )}
                    <input
                        className="w-full  px-6 py-3 text-lg bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent shadow-2xl transition-all"
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder={placeholder}
                    />
                    <button
                        type="submit"
                        className={`absolute right-2 -translate-y-1/2 p-4 rounded-full text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 ${hasResults ? 'top-1/2' : 'top-3/4'
                            }`}
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};