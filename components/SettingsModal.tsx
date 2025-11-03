import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (apiKey: string) => void;
    currentApiKey: string | null;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentApiKey }) => {
    const [apiKeyInput, setApiKeyInput] = useState('');

    useEffect(() => {
        if (isOpen) {
            setApiKeyInput(currentApiKey || '');
        }
    }, [isOpen, currentApiKey]);

    const handleSave = () => {
        if (apiKeyInput.trim()) {
            onSave(apiKeyInput.trim());
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-black w-full max-w-lg m-4 p-6 border border-gray-200 dark:border-gray-800"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Settings</h2>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Gemini API Key
                        </label>
                        <input
                            type="password"
                            id="apiKey"
                            value={apiKeyInput}
                            onChange={(e) => setApiKeyInput(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            placeholder="Enter your API key"
                        />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-900/50 border-l-2 border-gray-400 dark:border-gray-600">
                        <h3 className="font-semibold mb-1">How to get your API key:</h3>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Visit{' '}
                                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-black dark:hover:text-white">
                                    Google AI Studio
                                </a>.
                            </li>
                            <li>Click "Create API key in new project".</li>
                            <li>Copy the generated key and paste it above.</li>
                        </ol>
                        <p className="mt-2">Your API key is stored securely in your browser's local storage and is never sent anywhere except to Google's API.</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-600 dark:border-gray-400 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 border border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100 text-white dark:text-black font-semibold hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};