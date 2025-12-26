
'use client'

import { useState } from 'react';
import ReportModal from './ReportModal';

export default function AddSpotButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
            >
                <span className="text-xl">📍</span>
                新しい洗車場を登録
            </button>
            <ReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
