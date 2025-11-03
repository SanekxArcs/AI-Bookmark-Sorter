import React from 'react';

const SuggestionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 011-1h.5a1.5 1.5 0 000-3H6a1 1 0 01-1-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
    </svg>
);

const ResetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
    </svg>
);


interface AnalysisSummaryProps {
    bookmarkCount: number;
    onStart: () => void;
    onReset: () => void;
}

export const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ bookmarkCount, onStart, onReset }) => {
    const baseButtonClass = "flex-1 w-full sm:w-auto flex items-center justify-center px-6 py-3 font-semibold border transition-colors duration-300";
    const primaryButtonClass = "bg-gray-900 dark:bg-gray-100 text-white dark:text-black border-gray-900 dark:border-gray-100 hover:bg-gray-700 dark:hover:bg-gray-300";
    const secondaryButtonClass = "bg-transparent border-gray-600 dark:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800";

    return (
        <div className="text-center p-4 bg-transparent border-y border-gray-200 dark:border-gray-800 space-y-4">
            <p className="text-lg text-gray-700 dark:text-gray-300">
                Successfully parsed your file. Found <span className="font-bold text-black dark:text-white">{bookmarkCount}</span> bookmarks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                 <button onClick={onStart} className={`${baseButtonClass} ${primaryButtonClass}`}>
                    <SuggestionIcon />
                    Start AI Sorting
                </button>
                <button onClick={onReset} className={`${baseButtonClass} ${secondaryButtonClass}`}>
                    <ResetIcon />
                    Reset
                </button>
            </div>
        </div>
    );
};