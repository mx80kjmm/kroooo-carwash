
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function verifyAdminUser() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/admin/login');
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];

    if (!user.email || !adminEmails.includes(user.email)) {
        console.warn(`Unauthorized admin access attempt by: ${user.email}`);
        redirect('/');
    }

    return user;
}
