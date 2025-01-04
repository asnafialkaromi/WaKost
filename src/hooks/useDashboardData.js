// src/hooks/useDashboardData.js
import { useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";

export const useDashboardData = () => {
    const [stats, setStats] = useState({
        properties: 0,
        recommendations: 0,
        facilities: 0,
        faqs: 0,
    });

    const [loadingStats, setLoadingStats] = useState(true);
    const [errorStats, setErrorStats] = useState(null);

    const fetchStats = async () => {
        setLoadingStats(true);
        try {
            const [
                { count: propertiesCount },
                { count: recommendationsCount },
                { count: facilitiesCount },
                { count: faqsCount },
            ] = await Promise.all([
                supabase.from("properties").select("id", { count: "exact" }),
                supabase.from("recommendations").select("id", { count: "exact" }),
                supabase.from("facilities").select("id", { count: "exact" }),
                supabase.from("faqs").select("id", { count: "exact" }),
            ]);

            setStats({
                properties: propertiesCount || 0,
                recommendations: recommendationsCount || 0,
                facilities: facilitiesCount || 0,
                faqs: faqsCount || 0,
            });
            setLoadingStats(false);
        } catch (error) {
            console.error("Error fetching stats:", error.message);
            setErrorStats(error.message);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return {
        stats,
        fetchStats,
        loadingStats,
        errorStats,
    };
};
