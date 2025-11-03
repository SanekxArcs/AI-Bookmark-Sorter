export interface Bookmark {
  title: string;
  url: string;
  tags?: string[];
}

export interface BookmarkFolder {
  folderName: string;
  bookmarks: Bookmark[];
  subfolders: BookmarkFolder[];
}
