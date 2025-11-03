import React, { useRef } from 'react';

interface FileUploaderProps {
    onFileUpload: (file: File) => void;
    fileName: string;
    disabled: boolean;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, fileName, disabled }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-500 transition-colors duration-300 bg-transparent">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".html"
                className="hidden"
                disabled={disabled}
            />
            <button
                onClick={handleClick}
                disabled={disabled}
                className="flex items-center justify-center px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-black font-semibold hover:bg-gray-700 dark:hover:bg-gray-300 disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
            >
                <UploadIcon />
                {fileName ? "Upload Different File" : "Upload Bookmarks File"}
            </button>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {fileName ? `Selected: ${fileName}` : "Export your bookmarks as an HTML file from your browser."}
            </p>
        </div>
    );
};