import React from 'react';

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const ResetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
    </svg>
);

const VisualizeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

interface ActionButtonsProps {
    onDownload: () => void;
    onReset: () => void;
    viewMode: 'list' | 'graph';
    onToggleView: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onDownload, onReset, viewMode, onToggleView }) => {
    
    const baseButtonClass = "flex-1 w-full sm:w-auto flex items-center justify-center px-6 py-3 font-semibold border transition-colors duration-300";
    const primaryButtonClass = "bg-gray-900 dark:bg-gray-100 text-white dark:text-black border-gray-900 dark:border-gray-100 hover:bg-gray-700 dark:hover:bg-gray-300 disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-wait";
    const secondaryButtonClass = "bg-transparent border-gray-600 dark:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800";

    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center p-4 bg-transparent border-y border-gray-200 dark:border-gray-800">
            <button
                onClick={onDownload}
                className={`${baseButtonClass} ${primaryButtonClass}`}
            >
                <DownloadIcon />
                Download Sorted File
            </button>
            <button
                onClick={onToggleView}
                className={`${baseButtonClass} ${secondaryButtonClass}`}
            >
                <VisualizeIcon />
                {viewMode === 'list' ? 'Visualize' : 'Show List'}
            </button>
            <button
                onClick={onReset}
                className={`${baseButtonClass} ${secondaryButtonClass}`}
            >
                <ResetIcon />
                Reset
            </button>
        </div>
    );
};