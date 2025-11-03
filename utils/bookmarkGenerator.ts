import type { BookmarkFolder, Bookmark } from '../types';

const generateHtmlHeader = (): string => {
    return `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`;
};

const generateHtmlFooter = (): string => {
    return `</DL><p>\n`;
};

const generateFolderHtml = (folder: BookmarkFolder, indentLevel: number): string => {
    const indent = '    '.repeat(indentLevel);
    let folderContent = `${indent}<DT><H3>${folder.folderName}</H3>\n`;
    folderContent += `${indent}<DL><p>\n`;

    folder.bookmarks.forEach(bookmark => {
        folderContent += generateBookmarkHtml(bookmark, indentLevel + 1);
    });

    folder.subfolders.forEach(subfolder => {
        folderContent += generateFolderHtml(subfolder, indentLevel + 1);
    });

    folderContent += `${indent}</DL><p>\n`;
    return folderContent;
};

const generateBookmarkHtml = (bookmark: Bookmark, indentLevel: number): string => {
    const indent = '    '.repeat(indentLevel);
    const tagsAttribute = bookmark.tags && bookmark.tags.length > 0
        ? ` TAGS="${bookmark.tags.join(',')}"`
        : '';
    return `${indent}<DT><A HREF="${bookmark.url}"${tagsAttribute}>${bookmark.title}</A>\n`;
};


export const generateBookmarksHtml = (structure: BookmarkFolder[]): string => {
    let html = generateHtmlHeader();
    
    structure.forEach(folder => {
        html += generateFolderHtml(folder, 1);
    });

    html += generateHtmlFooter();
    
    return html;
};
