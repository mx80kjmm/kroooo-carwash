
'use client'

import { useState, useActionState } from 'react';
import { submitReportAction } from '@/app/actions/submit-report';

interface ReportModalProps {
    locationId?: string;
    isOpen: boolean;
    onClose: () => void;
    locationName?: string;
}

const initialState = {
    success: false,
    message: '',
};

export default function ReportModal({ locationId, isOpen, onClose, locationName }: ReportModalProps) {
    const [state, formAction, isPending] = useActionState(submitReportAction, initialState);
    // const [isSubmitting, setIsSubmitting] = useState(false); // useActionState provides pending state


    if (!isOpen) return null;

    // If success, show success message and simple close button
    if (state.success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
                    <h3 className="text-xl font-bold text-green-600 mb-2">送信完了</h3>
                    <p className="text-gray-700 mb-4">{state.message}</p>
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                        閉じる
                    </button>
                </div>
            </div>
        );
    }

    const isNewSpot = !locationId;
    const title = isNewSpot ? '新しい洗車場を登録' : '情報の修正・報告';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                {!isNewSpot && (
                    <p className="text-sm text-gray-600 mb-4">
                        「{locationName}」に関する情報を教えてください。
                    </p>
                )}
                {isNewSpot && (
                    <p className="text-sm text-gray-600 mb-4">
                        マップに載っていない洗車場をご存知ですか？<br />
                        Google MapsのURLや住所を教えてください。
                    </p>
                )}

                <form action={formAction}>
                    {locationId && <input type="hidden" name="location_id" value={locationId} />}

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            報告の種類
                        </label>
                        <select
                            name="type"
                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            defaultValue={isNewSpot ? 'new_location' : 'correction'}
                        >
                            {!isNewSpot && <option value="closure">閉店している</option>}
                            {!isNewSpot && <option value="correction">情報が間違っている</option>}
                            <option value="new_location">新しい洗車場（場所違いなど）</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            詳細コメント
                        </label>
                        <textarea
                            name="comment"
                            className="w-full border border-gray-300 rounded p-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="例: 2024年末で閉店していました。看板がなくなっていました。"
                            required
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            証拠画像（任意）
                        </label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-400 mt-1">※看板や現地の様子など</p>
                    </div>

                    {state.message && !state.success && (
                        <p className="text-red-500 text-sm mb-4">{state.message}</p>
                    )}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                            disabled={isPending}
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                            disabled={isPending}
                        >
                            {isPending ? '送信中...' : '送信する'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
