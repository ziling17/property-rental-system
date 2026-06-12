import { supabase } from './supabase';

export async function getProperties() {
    const { data, error } = await supabase
        .from('properties')
        .select(`
      *,
      property_images (image_url, sort_order),
      property_amenities (
        amenities (name, icon_name)
      ),
      property_stability_breakdown (*)
    `);

    if (error) {
        console.error('Error fetching properties:', error);
        return [];
    }

    return data;
}