
'use client'

import { useState } from 'react';
import ReportModal from './ReportModal';

export default function ReportButton({ locationId, locationName }: { locationId: string, locationName: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 text-white/50 text-sm hover:text-white transition-colors mt-4"
            >
                <span className="text-lg">⚠️</span>
                <span className="underline decoration-dotted underline-offset-4">
                    閉店・情報の間違いを報告する
                </span>
            </button>
            <ReportModal
                locationId={locationId}
                locationName={locationName}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
