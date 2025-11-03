import { Bookmark, BookmarkFolder } from '../types';

interface GraphNode {
    id: string;
    name: string;
    type: 'folder' | 'bookmark';
    url?: string;
}

interface GraphLink {
    source: string;
    target: string;
    type: 'hierarchy' | 'tag';
}

export const transformToGraphData = (structure: BookmarkFolder[]): { nodes: GraphNode[], links: GraphLink[] } => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const tagMap = new Map<string, string[]>(); // Map of tag -> [bookmark URLs]

    const traverse = (folders: BookmarkFolder[], parentId?: string) => {
        folders.forEach(folder => {
            const folderId = `folder-${folder.folderName}-${Math.random()}`;
            nodes.push({ id: folderId, name: folder.folderName, type: 'folder' });

            if (parentId) {
                links.push({ source: parentId, target: folderId, type: 'hierarchy' });
            }

            folder.bookmarks.forEach(bookmark => {
                nodes.push({ id: bookmark.url, name: bookmark.title, type: 'bookmark', url: bookmark.url });
                links.push({ source: folderId, target: bookmark.url, type: 'hierarchy' });
                
                bookmark.tags?.forEach(tag => {
                    if (!tagMap.has(tag)) {
                        tagMap.set(tag, []);
                    }
                    tagMap.get(tag)!.push(bookmark.url);
                });
            });

            if (folder.subfolders) {
                traverse(folder.subfolders, folderId);
            }
        });
    };

    traverse(structure);

    // Create links based on shared tags
    for (const urls of tagMap.values()) {
        if (urls.length > 1) {
            for (let i = 0; i < urls.length; i++) {
                for (let j = i + 1; j < urls.length; j++) {
                    links.push({ source: urls[i], target: urls[j], type: 'tag' });
                }
            }
        }
    }

    // Filter out duplicate nodes (can happen if a URL appears multiple times)
    const uniqueNodes = Array.from(new Map(nodes.map(node => [node.id, node])).values());

    return { nodes: uniqueNodes, links };
};