'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getAllAnnouncementsAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
  return data || [];
}

export type AnnouncementActionResult = { success: boolean; error?: string };

export async function createAnnouncement(message: string): Promise<AnnouncementActionResult> {
  if (!message?.trim()) return { success: false, error: 'Message is required.' };
  const supabase = createAdminClient();
  const { error } = await supabase.from('announcements').insert({ message: message.trim(), is_active: true });
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/announcements');
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function updateAnnouncement(id: string, message: string): Promise<AnnouncementActionResult> {
  if (!message?.trim()) return { success: false, error: 'Message is required.' };
  const supabase = createAdminClient();
  const { error } = await supabase.from('announcements').update({ message: message.trim() }).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/announcements');
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function toggleAnnouncementActive(id: string, isActive: boolean): Promise<AnnouncementActionResult> {
  const supabase = createAdminClient();
  const { error } = await supabase.from('announcements').update({ is_active: isActive }).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/announcements');
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function deleteAnnouncement(id: string): Promise<AnnouncementActionResult> {
  const supabase = createAdminClient();
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/announcements');
  revalidatePath('/', 'layout');
  return { success: true };
}
