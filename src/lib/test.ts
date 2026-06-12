import { supabase } from './supabase';

export async function testConnection() {
    const { data, error } = await supabase
        .from('properties')
        .select('*');

    console.log(data);
    console.log(error);
}