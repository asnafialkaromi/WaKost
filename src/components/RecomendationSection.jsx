import React, { useEffect, useState } from "react";
import RecomendationCard from "./ui/RecomendationCard";
import { supabase } from "../api/supabaseClient";

function RecomendationSection() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("recommendations").select(`
        id,
        property_id,
        properties (
          name,
          city,
          images(url)
        )
      `);
      if (error) throw error;
      setRecommendations(data || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <section className="max-w-full h-fit my-10">
      <div className="max-w-7xl h-full place-items-center mx-auto py-14 px-4 gap-20">
        {/* Up Side */}
        <p className="text-4xl font-bold text-[#303a42] text-center mb-6">
          Rekomendasi Kost
        </p>

        {/* Down Side */}
        {loading ? (
          <p className="text-center text-gray-500">
            Loading recommendations...
          </p>
        ) : recommendations.length > 0 ? (
          <div className="flex md:flex-row flex-col gap-8 max-w-5xl items-center">
            {recommendations.map((recommendation) => (
              <RecomendationCard
                key={recommendation.id}
                title={recommendation.properties.name}
                description={recommendation.properties.city}
                image={recommendation.properties.images[0].url}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No recommendations found.</p>
        )}
      </div>
    </section>
  );
}

export default RecomendationSection;
