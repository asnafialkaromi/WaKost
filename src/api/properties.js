import { supabase } from './supabaseClient';

export const fetchProperties = async () => {
    const { data, error } = await supabase
        .from('properties')
        .select(`
            id,
            name,
            description,
            price_per_month,
            latitude,
            longitude,
            address,
            categories (name),
            owners (name, phone, email),
            property_facilities (facilities (id,name))
          `);

    if (error) throw error;
    return data;
};