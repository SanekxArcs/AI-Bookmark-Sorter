
import type { Bookmark } from '../types';

export const parseBookmarksHtml = (htmlContent: string): Bookmark[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const links = doc.querySelectorAll('a');
    
    const bookmarks: Bookmark[] = [];
    links.forEach(link => {
        const title = link.textContent?.trim() || 'No Title';
        const url = link.getAttribute('href');
        if (url && !url.startsWith('data:')) { // Exclude base64 encoded favicons
            bookmarks.push({ title, url });
        }
    });

    return bookmarks;
};
