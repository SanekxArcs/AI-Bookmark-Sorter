import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { BookmarkFolder, Bookmark } from './types';
import { getBookmarkSuggestionsStream } from './services/geminiService';
import { parseBookmarksHtml } from './utils/bookmarkParser';
import { generateBookmarksHtml } from './utils/bookmarkGenerator';
import { transformToGraphData } from './utils/graphTransformer';
import { FileUploader } from './components/FileUploader';
import { SuggestionViewer } from './components/SuggestionViewer';
import { ActionButtons } from './components/ActionButtons';
import { Header } from './components/Header';
import { StreamingResponse } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { GraphVisualizer } from './components/GraphVisualizer';
import { AnalysisSummary } from './components/AnalysisSummary';
import { SettingsModal } from './components/SettingsModal';

type Theme = 'light' | 'dark';
type ViewMode = 'list' | 'graph';

const App: React.FC = () => {
    const [originalBookmarks, setOriginalBookmarks] = useState<Bookmark[]>([]);
    const [suggestedStructure, setSuggestedStructure] = useState<BookmarkFolder[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [streamedData, setStreamedData] = useState<string>('');
    
    const [theme, setTheme] = useState<Theme>('dark');
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [apiKey, setApiKey] = useState<string | null>(null);

    const graphData = useMemo(() => {
        if (!suggestedStructure) return { nodes: [], links: [] };
        return transformToGraphData(suggestedStructure);
    }, [suggestedStructure]);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        const storedApiKey = localStorage.getItem('geminiApiKey');
        
        if (storedApiKey) {
            setApiKey(storedApiKey);
        }

        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark ? 'dark' : 'light');
        }
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    const handleFileUpload = useCallback((file: File) => {
        if (!file) return;
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const bookmarks = parseBookmarksHtml(content);
                if (bookmarks.length === 0) {
                    setError("No bookmarks found in the uploaded file. Please check the file format.");
                    return;
                }
                setOriginalBookmarks(bookmarks);
                setError(null);
                setSuggestedStructure(null);
            } catch (err) {
                console.error("Parsing error:", err);
                setError("Failed to parse the bookmarks file. Please ensure it's a valid HTML export from your browser.");
            }
        };
        reader.onerror = () => setError("Failed to read the file.");
        reader.readAsText(file);
    }, []);

    const handleGetSuggestions = useCallback(async () => {
        if (originalBookmarks.length === 0) {
            setError("Please upload a bookmarks file first.");
            return;
        }

        if (!apiKey) {
            setError("Please set your Gemini API key in the settings before proceeding.");
            setIsSettingsOpen(true);
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuggestedStructure(null);
        setStreamedData('');
        setViewMode('list');

        try {
            const suggestions = await getBookmarkSuggestionsStream(
                originalBookmarks,
                apiKey,
                (chunk) => {
                    setStreamedData(prev => prev + chunk);
                }
            );
            setSuggestedStructure(suggestions);
        } catch (err) {
            console.error("Gemini API error:", err);
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(`Failed to get suggestions. ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [originalBookmarks, apiKey]);

    const handleDownload = useCallback(() => {
        if (!suggestedStructure) return;
        try {
            const newHtml = generateBookmarksHtml(suggestedStructure);
            const blob = new Blob([newHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sorted_bookmarks.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download generation error:", err);
            setError("Failed to generate the download file.");
        }
    }, [suggestedStructure]);
    
    const handleReset = useCallback(() => {
        setOriginalBookmarks([]);
        setSuggestedStructure(null);
        setIsLoading(false);
        setError(null);
        setFileName('');
        setStreamedData('');
        setViewMode('list');
    }, []);

    const handleUpdateBookmarkTags = useCallback((bookmarkUrl: string, newTags: string[]) => {
        const updateRecursively = (items: (BookmarkFolder | Bookmark)[]): any[] => {
            return items.map(item => {
                if ('url' in item && item.url === bookmarkUrl) {
                    return { ...item, tags: newTags };
                }
                if ('folderName' in item) {
                    return {
                        ...item,
                        bookmarks: updateRecursively(item.bookmarks) as Bookmark[],
                        subfolders: updateRecursively(item.subfolders) as BookmarkFolder[],
                    };
                }
                return item;
            });
        };
    
        setSuggestedStructure(prev => prev ? updateRecursively(prev) as BookmarkFolder[] : null);
    }, []);

    const handleSaveApiKey = (newKey: string) => {
        setApiKey(newKey);
        localStorage.setItem('geminiApiKey', newKey);
        setIsSettingsOpen(false);
    };

    const toggleViewMode = () => setViewMode(prev => prev === 'list' ? 'graph' : 'list');

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
            <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
                <Header 
                    theme={theme}
                    setTheme={setTheme}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                />
                <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
                    <ErrorDisplay message={error} />
                    
                    {/* Loading State */}
                    {isLoading && <StreamingResponse data={streamedData} />}

                    {/* Result State */}
                    {!isLoading && suggestedStructure && (
                        <>
                         <ActionButtons
                            onDownload={handleDownload}
                            onReset={handleReset}
                            viewMode={viewMode}
                            onToggleView={toggleViewMode}
                        />
                        <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6">
                           <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
                                {viewMode === 'list' ? 'AI-Suggested Organization' : 'Bookmark Relationship Graph'}
                           </h2>
                           {viewMode === 'list' ? (
                               <SuggestionViewer structure={suggestedStructure} onUpdateTags={handleUpdateBookmarkTags} />
                           ) : (
                               <GraphVisualizer data={graphData} theme={theme} />
                           )}
                        </div>
                        </>
                    )}

                    {/* Initial and Analysis State */}
                    {!isLoading && !suggestedStructure && (
                        <>
                            <FileUploader onFileUpload={handleFileUpload} fileName={fileName} disabled={false} />
                            {originalBookmarks.length > 0 && (
                                <AnalysisSummary
                                    bookmarkCount={originalBookmarks.length}
                                    onStart={handleGetSuggestions}
                                    onReset={handleReset}
                                />
                            )}
                        </>
                    )}
                </div>
                <footer className="text-center text-gray-500 dark:text-gray-600 mt-8 text-sm">
                    <p>Powered by Google Gemini</p>
                </footer>
            </main>
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onSave={handleSaveApiKey}
                currentApiKey={apiKey}
            />
        </div>
    );
};

export default App;