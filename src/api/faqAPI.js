import { supabase } from './supabaseClient';

export const fetchFaqs = async () => {
    const { data, error } = await supabase.from("faqs").select("*");
    if (error) return { error: error.message };
    return { data };
};

export const addFaq = async (newFaq) => {
    const { error } = await supabase.from("faqs").insert([newFaq]);
    if (error) throw new Error(error.message);
};

export const updateFaq = async (editFaq) => {
    const { error } = await supabase.from("faqs").update(editFaq).eq("id", editFaq.id);
    if (error) throw new Error(error.message);
};

export const deleteFaq = async (id) => {
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) throw new Error(error.message);
};
