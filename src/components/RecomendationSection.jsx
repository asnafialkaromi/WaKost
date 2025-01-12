import React, { useEffect, useState } from "react";
import RecomendationCard from "./ui/RecomendationCard";
import { supabase } from "../api/supabaseClient";
import { Card, CardBody, CardHeader, Skeleton } from "@nextui-org/react";
import RecommendationCarrousel from "./common/RecommendationCarrousel";

function RecomendationSection() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("recommendations").select(`
        id,
        properties (
          id,
          name,
          property_type,
          price,
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
    <section className="h-fit ">
      <div className="h-full place-items-center py-14 px-4 gap-20">
        {/* Up Side */}
        <p className="text-4xl font-bold text-[#303a42] text-center mb-6">
          Rekomendasi Kost
        </p>

        {/* Down Side */}
        {loading ? (
          <div className="flex md:flex-row flex-col gap-8 w-full max-w-7xl items-center justify-center px-8">
            <Card className="pb-4 w-full max-w-80 h-80">
              <CardBody className="max-w-xs">
                <Skeleton className="rounded-xl w-full h-40" />
              </CardBody>
              <CardHeader className="pb-0 pt-2 px-4 flex-col gap-2 items-start max-w-xs">
                <Skeleton className="mb-2 w-1/3 h-4" />
                <Skeleton className="mb-2 w-1/2 h-4" />
                <Skeleton className="mb-2 w-4/5 h-4" />
                <Skeleton className="mb-2 w-2/5 h-4" />
              </CardHeader>
            </Card>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="flex md:flex-row flex-col gap-8 w-full max-w-7xl items-center justify-center px-8">
            {recommendations.map((recommendation) => (
              <div key={recommendation.id} data-aos="fade-up">
                <RecomendationCard
                  key={recommendation.id}
                  id={recommendation.properties.id}
                  type={recommendation.properties.property_type}
                  price={recommendation.properties.price}
                  title={recommendation.properties.name}
                  city={recommendation.properties.city}
                  image={recommendation.properties.images[0].url}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Tidak ada rekomendasi</p>
        )}
      </div>
    </section>
  );
}

export default RecomendationSection;
