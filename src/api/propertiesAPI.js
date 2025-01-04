import { supabase } from "./supabaseClient";

export const fetchProperties = async () => {
    try {
        const { data, error } = await supabase
            .from("properties")
            .select(`
            id,
            name,
            property_type,
            city,
            address,
            images (url),
            description,
            price,
            latitude,
            longitude,
            address,
            property_facilities (facilities (id,name))
          `);

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error("Error fetching properties:", error.message);
        return { success: false, message: error.message };
    }
};
