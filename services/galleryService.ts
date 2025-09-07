import { GalleryItem } from '../types.ts';

const recursivelyUpdate = (
    items: GalleryItem[],
    updateFn: (item: GalleryItem) => GalleryItem | null | GalleryItem[]
): GalleryItem[] => {
    return items.flatMap(item => {
        const result = updateFn(item);
        if (result === null) return []; // Delete the item

        const updatedItems = Array.isArray(result) ? result : [result];

        return updatedItems.map(updatedItem => {
            if (updatedItem.children) {
                return { ...updatedItem, children: recursivelyUpdate(updatedItem.children, updateFn) };
            }
            return updatedItem;
        });
    });
};

export const findItem = (root: GalleryItem, itemId: string): GalleryItem | null => {
    if (root.id === itemId) {
        return root;
    }
    if (root.children) {
        for (const child of root.children) {
            const found = findItem(child, itemId);
            if (found) {
                return found;
            }
        }
    }
    return null;
};

export const deleteItems = (root: GalleryItem, itemIds: string[]): GalleryItem => {
    const idSet = new Set(itemIds);
    const updateFn = (item: GalleryItem) => (idSet.has(item.id) ? null : item);
    const newChildren = recursivelyUpdate(root.children || [], updateFn);
    return { ...root, children: newChildren };
};

export const renameItem = (root: GalleryItem, itemId: string, newName: string): GalleryItem => {
    const updateFn = (item: GalleryItem) =>
        item.id === itemId ? { ...item, name: newName } : item;

    if (root.id === itemId) {
        return { ...root, name: newName, children: recursivelyUpdate(root.children || [], updateFn) };
    }

    const newChildren = recursivelyUpdate(root.children || [], updateFn);
    return { ...root, children: newChildren };
};

export const createFolder = (root: GalleryItem, parentId: string, newFolder: GalleryItem): GalleryItem => {
    if (root.id === parentId) {
        return { ...root, children: [newFolder, ...(root.children || [])] };
    }

    const updateFn = (item: GalleryItem) => {
        if (item.id === parentId) {
            return { ...item, children: [newFolder, ...(item.children || [])] };
        }
        return item;
    };

    const newChildren = recursivelyUpdate(root.children || [], updateFn);
    return { ...root, children: newChildren };
};


export const moveItems = (root: GalleryItem, itemIdsToMove: string[], destinationFolderId: string): GalleryItem => {
    let itemsToMove: GalleryItem[] = [];
    const idSet = new Set(itemIdsToMove);

    // 1. Find and collect items to move, and prepare for their removal
    const findAndRemoveFn = (item: GalleryItem) => {
        if (idSet.has(item.id)) {
            itemsToMove.push(item);
            return null; // Remove from original position
        }
        return item;
    };

    let newRoot = { ...root, children: recursivelyUpdate(root.children || [], findAndRemoveFn) };

    // 2. Add the collected items to the destination folder
    const addFn = (item: GalleryItem) => {
        if (item.id === destinationFolderId) {
            return { ...item, children: [...itemsToMove, ...(item.children || [])] };
        }
        return item;
    };

    if (destinationFolderId === newRoot.id) {
        newRoot.children = [...itemsToMove, ...(newRoot.children || [])];
    } else {
        newRoot.children = recursivelyUpdate(newRoot.children || [], addFn);
    }

    return newRoot;
};

// Helper to build a folder tree for the move modal
export const getFolderTree = (root: GalleryItem): GalleryItem | null => {
    if (root.type !== 'folder') return null;
    
    const childrenFolders = (root.children || [])
        .map(getFolderTree)
        .filter((item): item is GalleryItem => item !== null);

    return { ...root, children: childrenFolders };
};

export const stripFileObjects = (root: GalleryItem): GalleryItem => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { file, ...rest } = root;
    const newRoot = rest;

    if (newRoot.children) {
        newRoot.children = newRoot.children.map(stripFileObjects);
    }

    return newRoot;
};