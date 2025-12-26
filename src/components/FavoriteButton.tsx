
'use client';

import { useFavorites } from '@/hooks/useFavorites';
import { useEffect, useState } from 'react';

export default function FavoriteButton({ locationId, className = '' }: { locationId: string, className?: string }) {
    const { isFavorite, toggleFavorite, isLoaded } = useFavorites();
    const [active, setActive] = useState(false);

    useEffect(() => {
        setActive(isFavorite(locationId));
    }, [isFavorite, locationId, isLoaded]);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation if inside a link
        e.stopPropagation();
        toggleFavorite(locationId);
    };

    if (!isLoaded) return <div className={`w-8 h-8 ${className}`} />; // Placeholder

    return (
        <button
            onClick={handleClick}
            className={`p-2 rounded-full transition-colors ${active ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'} ${className}`}
            aria-label={active ? 'お気に入りから削除' : 'お気に入りに追加'}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </button>
    );
}
