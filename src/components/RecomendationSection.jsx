import React from "react";
import RecomendationCard from "./ui/RecomendationCard";

function RecomendationSection() {
  return (
    <section className="max-w-full h-fit my-10">
      <div className="max-w-5xl h-full place-items-center mx-auto py-14 px-4 gap-20">
        {/* Up Side */}
        <p className="text-4xl font-bold text-[#303a42] text-center mb-6">
          Rekomendasi Kost
        </p>

        {/* Down Side */}
        <div className="flex md:flex-row flex-col gap-8 max-w-5xl items-center">
          <RecomendationCard />
          <RecomendationCard />
          <RecomendationCard />
        </div>
      </div>
    </section>
  );
}

export default RecomendationSection;
