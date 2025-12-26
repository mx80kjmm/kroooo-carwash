
'use server'

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function fetchPendingReports() {
    const { data, error } = await supabaseAdmin
        .from('location_reports')
        .select(`
            *,
            carwash_locations ( name, address )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reports:', error);
        return [];
    }
    return data;
}

export async function approveReport(reportId: string) {
    // 1. Get the report
    const { data: report, error: fetchError } = await supabaseAdmin
        .from('location_reports')
        .select('*')
        .eq('id', reportId)
        .single();

    if (fetchError || !report) throw new Error('Report not found');

    // 2. Logic based on type
    let updateError = null;

    if (report.type === 'closure' && report.location_id) {
        // Logical delete
        const { error } = await supabaseAdmin
            .from('carwash_locations')
            .update({ is_active: false })
            .eq('id', report.location_id);
        updateError = error;
    }
    else if (report.type === 'new_location' && report.proposed_data) {
        // Insert new
        // proposed_data should contain name, address, etc.
        // For safety, we might need manual verification or robust parsing.
        // Here we assume proposed_data matches table schema or we just log it for manual add.
        // For MVP, if proposed_data is valid, insert.
        // But collecting full data from user is hard via simple form.
        // Maybe just mark as approved and let admin manually add?
        // Let's assume for Closure it's automatic. For New/Correction, it might need manual data entry in future.
        // For now, we update status to 'approved' and imply admin handled it manually or it's auto-handled if simple.
        // Let's implement Closure auto-handle. Others just approve status.
    }

    if (updateError) throw new Error('Failed to update location');

    // 3. Update report status
    const { error: statusError } = await supabaseAdmin
        .from('location_reports')
        .update({ status: 'approved' })
        .eq('id', reportId);

    if (statusError) throw new Error('Failed to update report status');

    revalidatePath('/admin');
    return { success: true };
}

export async function rejectReport(reportId: string) {
    const { error } = await supabaseAdmin
        .from('location_reports')
        .update({ status: 'rejected' })
        .eq('id', reportId);

    if (error) throw new Error('Failed to reject report');

    revalidatePath('/admin');
    return { success: true };
}
