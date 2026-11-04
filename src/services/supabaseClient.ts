import { createClient } from '@supabase/supabase-js';
import type { Vehicle, Post, Review, Order } from '../types';

export const SUPABASE_URL = 'https://gqogjgwltnckvcjqkani.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxb2dqZ3dsdG5ja3ZjanFrYW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4MDIxNTksImV4cCI6MjEwOTM3ODE1OX0.evynFf5jE17t4jVaQyhv6oYgfyLzUKMB9dtTwYkYQbI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseHealth {
  connected: boolean;
  message: string;
  vehicleCount: number;
  postCount: number;
  reviewCount: number;
  orderCount: number;
}

export async function checkSupabaseHealth(): Promise<SupabaseHealth> {
  try {
    const { data: vData, error: vErr } = await supabase.from('vehicles').select('id', { count: 'exact' });
    if (vErr) {
      return {
        connected: false,
        message: vErr.message || 'Error querying vehicles table',
        vehicleCount: 0,
        postCount: 0,
        reviewCount: 0,
        orderCount: 0,
      };
    }

    const { count: pCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
    const { count: rCount } = await supabase.from('reviews').select('*', { count: 'exact', head: true });
    const { count: oCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });

    return {
      connected: true,
      message: 'Connected to Supabase live instance',
      vehicleCount: vData?.length ?? 0,
      postCount: pCount ?? 0,
      reviewCount: rCount ?? 0,
      orderCount: oCount ?? 0,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: err?.message || 'Connection failed',
      vehicleCount: 0,
      postCount: 0,
      reviewCount: 0,
      orderCount: 0,
    };
  }
}

export async function fetchVehiclesFromSupabase(): Promise<Vehicle[] | null> {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return null;
    return data as Vehicle[];
  } catch {
    return null;
  }
}

export async function fetchPostsFromSupabase(): Promise<Post[] | null> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false });
    if (error || !data || data.length === 0) return null;
    return data as Post[];
  } catch {
    return null;
  }
}

export async function fetchReviewsFromSupabase(): Promise<Review[] | null> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;
    return data as Review[];
  } catch {
    return null;
  }
}

export async function fetchOrdersFromSupabase(): Promise<Order[] | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return null;
    return data as Order[];
  } catch {
    return null;
  }
}

export async function insertOrderToSupabase(order: Order): Promise<boolean> {
  try {
    const { error } = await supabase.from('orders').insert([order]);
    return !error;
  } catch {
    return false;
  }
}

export async function updateOrderStatusInSupabase(orderId: string, status: Order['status']): Promise<boolean> {
  try {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    return !error;
  } catch {
    return false;
  }
}

export async function insertVehicleToSupabase(vehicle: Vehicle): Promise<boolean> {
  try {
    const { error } = await supabase.from('vehicles').insert([vehicle]);
    return !error;
  } catch {
    return false;
  }
}

export async function updateVehicleInSupabase(id: string, updates: Partial<Vehicle>): Promise<boolean> {
  try {
    const { error } = await supabase.from('vehicles').update(updates).eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteVehicleInSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function insertReviewToSupabase(review: Review): Promise<boolean> {
  try {
    const { error } = await supabase.from('reviews').insert([review]);
    return !error;
  } catch {
    return false;
  }
}

export async function syncBatchToSupabase(
  vehicles: Vehicle[],
  posts: Post[],
  reviews: Review[]
): Promise<{ success: boolean; message: string }> {
  try {
    const { error: vErr } = await supabase.from('vehicles').upsert(vehicles, { onConflict: 'id' });
    if (vErr) return { success: false, message: `Vehicles sync failed: ${vErr.message}` };

    const { error: pErr } = await supabase.from('posts').upsert(posts, { onConflict: 'id' });
    if (pErr) return { success: false, message: `Posts sync failed: ${pErr.message}` };

    const { error: rErr } = await supabase.from('reviews').upsert(reviews, { onConflict: 'id' });
    if (rErr) return { success: false, message: `Reviews sync failed: ${rErr.message}` };

    return { success: true, message: 'Successfully synced all records to Supabase!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Sync failed' };
  }
}

