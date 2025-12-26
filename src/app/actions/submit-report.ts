'use server'

import { supabase } from '@/lib/supabase';
import { sendLineNotify } from '@/lib/notifications';

interface SubmitState {
    success: boolean;
    message: string;
}

export async function submitReportAction(prevState: SubmitState, formData: FormData): Promise<SubmitState> {
    const locationId = formData.get('location_id') ? String(formData.get('location_id')) : null;
    const type = formData.get('type') as string;
    const comment = formData.get('comment') as string;

    // Simple validation
    if (!type || !comment) {
        return { success: false, message: '必須項目（報告の種類、コメント）を入力してください。' };
    }

    const imageFile = formData.get('image') as File | null;
    let imageUrl = null;

    try {
        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const { data, error: uploadError } = await supabase.storage
                .from('report-images')
                .upload(fileName, imageFile);

            if (uploadError) {
                console.error('Upload Error:', uploadError);
                // Continue without image or return error? Continue is better for UX, just log it.
            } else {
                const { data: publicUrlData } = supabase.storage
                    .from('report-images')
                    .getPublicUrl(fileName);
                imageUrl = publicUrlData.publicUrl;
            }
        }

        const { data, error } = await supabase.from('location_reports').insert({
            location_id: locationId || null,
            type,
            comment,
            status: 'pending',
            proposed_data: imageUrl ? { image_url: imageUrl } : null
        }).select().single(); // Added .select().single() to get the inserted data

        if (error) {
            console.error('Error submitting report:', error);
            return { success: false, message: '送信に失敗しました。再度お試しください。' };
        }

        // LINE通知
        const notifyMessage = `
🆕 新規レポート受信
種別: ${type === 'new_location' ? '新規登録' : type === 'correction' ? '情報修正' : '閉店報告'}
ID: ${data?.id ?? '不明'}
LocationID: ${locationId ?? '新規'}
コメント: ${comment}
${imageUrl ? `画像: ${imageUrl}` : ''}
        `.trim();

        // Don't await specifically? Or await to ensure it fires? 
        // Vercel Server Actions terminate after return. Better to await.
        await sendLineNotify(notifyMessage);

        return { success: true, message: '報告を受け付けました！ありがとうございます。' };
    } catch (err) {
        console.error('Unexpected Error:', err);
        return { success: false, message: '予期せぬエラーが発生しました。' };
    }
}
