import { supabase } from "./supabaseClient";

export const fetchRecommendations = async () => {
    try {
        const { data, error } = await supabase
            .from("recommendations")
            .select(
                "id, property_id, created_at, properties (name, city, address, property_type)"
            );

        if (error) throw new Error(error.message);

        return { success: true, data };
    } catch (error) {
        console.error("Error fetching recommendations:", error.message);
        return { success: false, data: [], message: error.message };
    }
};

export const addRecommendation = async (propertyId) => {
    try {
        const { data: existingRecommendation, error: fetchError } = await supabase
            .from("recommendations")
            .select("*")
            .eq("property_id", propertyId)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") {
            throw new Error(fetchError.message);
        }

        if (existingRecommendation) {
            return { success: false, message: "Properti ini sudah ada di rekomendasi." };
        }

        const { error } = await supabase.from("recommendations").insert({
            property_id: propertyId,
        });

        if (error) throw new Error(error.message);

        return { success: true, message: "Rekomendasi berhasil ditambahkan." };
    } catch (error) {
        console.error("Error adding recommendation:", error.message);
        return { success: false, message: error.message };
    }
};

export const deleteRecommendation = async (recommendationId) => {
    try {
        const { error } = await supabase
            .from("recommendations")
            .delete()
            .eq("id", recommendationId);

        if (error) throw new Error(error.message);

        return { success: true, message: "Rekomendasi berhasil dihapus." };
    } catch (error) {
        console.error("Error deleting recommendation:", error.message);
        return { success: false, message: error.message };
    }
};
