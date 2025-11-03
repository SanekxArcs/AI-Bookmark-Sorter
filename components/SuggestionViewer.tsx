import React, { useState, useRef, useEffect } from 'react';
import type { Bookmark, BookmarkFolder } from '../types';

type TagUpdateHandler = (url: string, tags: string[]) => void;

const FolderIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const BookmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
    </svg>
);


const BookmarkItem: React.FC<{ bookmark: Bookmark; onUpdateTags: TagUpdateHandler }> = ({ bookmark, onUpdateTags }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(bookmark.tags?.join(', ') || '');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) inputRef.current?.focus();
    }, [isEditing]);
    
    const handleSave = () => {
        if (!isEditing) return;
        const newTags = editText.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
        const uniqueTags = [...new Set(newTags)];
        onUpdateTags(bookmark.url, uniqueTags);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSave();
        else if (e.key === 'Escape') {
            setEditText(bookmark.tags?.join(', ') || '');
            setIsEditing(false);
        }
    };
    
    return (
        <li className="flex items-start text-sm ml-4 py-2 group">
            <BookmarkIcon />
            <div className="flex-1 min-w-0">
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white truncate block transition-colors duration-200">
                    {bookmark.title}
                </a>
                {isEditing ? (
                     <input 
                        ref={inputRef}
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className="w-full mt-1 bg-white dark:bg-black text-gray-800 dark:text-gray-200 border border-gray-500 dark:border-gray-500 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-gray-500"
                        placeholder="e.g. tech, news, shopping"
                    />
                ) : (
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                        {(bookmark.tags && bookmark.tags.length > 0) ? (
                            bookmark.tags.map(tag => (
                                <span key={tag} className="text-xs bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5">{tag}</span>
                            ))
                        ) : (
                            <span className="text-xs text-gray-400 dark:text-gray-600 italic">No tags</span>
                        )}
                    </div>
                )}
            </div>
             {!isEditing && (
                <button 
                    onClick={() => {
                        setEditText(bookmark.tags?.join(', ') || '');
                        setIsEditing(true);
                    }} 
                    className="ml-2 p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    aria-label="Edit tags"
                >
                    <EditIcon />
                </button>
            )}
        </li>
    );
};

const FolderItem: React.FC<{ folder: BookmarkFolder; onUpdateTags: TagUpdateHandler }> = ({ folder, onUpdateTags }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <li className="my-1">
            <div onClick={() => setIsOpen(!isOpen)} className="flex items-center cursor-pointer p-1 hover:bg-gray-100 dark:hover:bg-gray-800/50">
                <FolderIcon isOpen={isOpen} />
                <span className="font-semibold text-black dark:text-white">{folder.folderName}</span>
            </div>
            {isOpen && (
                <ul className="pl-5 border-l border-gray-200 dark:border-gray-800">
                    {folder.bookmarks.map((bookmark, index) => (
                        <BookmarkItem key={`${bookmark.url}-${index}`} bookmark={bookmark} onUpdateTags={onUpdateTags} />
                    ))}
                    {folder.subfolders.map((subfolder, index) => (
                        <FolderItem key={`${subfolder.folderName}-${index}`} folder={subfolder} onUpdateTags={onUpdateTags}/>
                    ))}
                </ul>
            )}
        </li>
    );
};

interface SuggestionViewerProps {
    structure: BookmarkFolder[];
    onUpdateTags: TagUpdateHandler;
}

export const SuggestionViewer: React.FC<SuggestionViewerProps> = ({ structure, onUpdateTags }) => {
    return (
        <div className="bg-transparent p-4 border border-gray-200 dark:border-gray-800 max-h-[60vh] overflow-y-auto">
            <ul>
                {structure.map((folder, index) => (
                    <FolderItem key={`${folder.folderName}-${index}`} folder={folder} onUpdateTags={onUpdateTags} />
                ))}
            </ul>
        </div>
    );
};