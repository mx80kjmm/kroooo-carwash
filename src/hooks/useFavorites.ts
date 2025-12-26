
'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'kroooo_favorites';

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load on mount
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse favorites', e);
            }
        }
        setIsLoaded(true);
    }, []);

    const save = (newFavorites: string[]) => {
        setFavorites(newFavorites);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    };

    const toggleFavorite = (id: string) => {
        if (favorites.includes(id)) {
            save(favorites.filter(fid => fid !== id));
        } else {
            save([...favorites, id]);
        }
    };

    const isFavorite = (id: string) => favorites.includes(id);

    return { favorites, toggleFavorite, isFavorite, isLoaded };
}
