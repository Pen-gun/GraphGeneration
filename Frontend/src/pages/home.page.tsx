import { useState } from "react";
import Layout from "../layout/layout";
import { SearchBar } from "../components/search/search.component.tsx";
import { ResultDisplay } from "../components/result/result.component.tsx";
import { useAIResponse } from "../utils/aiHandler.utils.tsx";

const homePage = () => {
    const [hasResults, setHasResults] = useState(false);
    const { mutate, data, isPending, isError } = useAIResponse();

    const handleSearch = (query: string) => {
        mutate(query, {
            onSuccess: () => {
                setHasResults(true);
            },
            onError: (error) => {
                console.error("Error fetching AI response:", error);
            }
        });
    };
    if (isError) {
        return <div>Error loading data.</div>
    };

    return (
        <Layout>
            <div className="min-h-screen w-full">
                {/* Results Section */}
                {data && (
                    <div className="w-full px-4 pt-8 pb-32">
                        <ResultDisplay
                            points={data.points}
                            diagram={data.diagram}
                            reasoning={data.reasoning}
                        />
                    </div>
                )}

                {/* Search Section */}
                <div className={`w-full transition-all duration-500 ${hasResults ? 
                'fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent pb-4 z-50' : ''
                    }`}>
                    <SearchBar
                        onSearch={handleSearch}
                        hasResults={hasResults}
                    />
                    {isPending && (
                        <div className="mt-2 text-center text-white animate-pulse text-sm">
                            Generating insights...
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
export default homePage;