import { useState, useCallback, useEffect } from 'react';

export function usePasteListener(onImagePasted: (file: File) => void) {
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            if(items[0].type.startsWith('image/')) {
                const file = items[0].getAsFile();
                if(file) {
                    onImagePasted(file);
                    e.preventDefault();
                }
            }

            // for (const item of items) {
            //     if (item.type.startsWith('image/')) {
            //         const file = item.getAsFile();
            //         if (file) {
            //             onImagePasted(file);
            //             e.preventDefault();
            //         }
            //         break;
            //     }
            // }
        };

        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [onImagePasted]);
}