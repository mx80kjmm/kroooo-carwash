
'use client';

import dynamic from 'next/dynamic';

const CarWashMap = dynamic(() => import('./CarWashMap'), {
    ssr: false,
    loading: () => (
        <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">
            <div className="flex flex-col items-center gap-2">
                <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading Map...</span>
            </div>
        </div>
    )
});

export default CarWashMap;
