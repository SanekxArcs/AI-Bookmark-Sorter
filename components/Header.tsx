import React from 'react';

type Theme = 'light' | 'dark';

interface HeaderProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    onOpenSettings: () => void;
}

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const Header: React.FC<HeaderProps> = ({ theme, setTheme, onOpenSettings }) => {
    return (
        <header className="mb-8">
            <div className="flex justify-between items-center">
                <div></div> {/* Spacer */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-center text-black dark:text-white">
                    AI Bookmark Sorter
                </h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 border border-transparent hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    </button>
                    <button onClick={onOpenSettings} className="p-2 border border-transparent hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                        <SettingsIcon />
                    </button>
                </div>
            </div>
             <p className="mt-4 text-lg text-center text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                Tidy up your digital library. Let AI intelligently categorize your browser bookmarks.
            </p>
        </header>
    );
};