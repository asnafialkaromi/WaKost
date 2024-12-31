import React from "react";
import FeatureCard from "./ui/FeatureCard";

function FeatureSection() {
  return (
    <section className="max-w-full h-[80vh]">
      <div className="max-w-7xl h-full flex flex-col md:flex-row items-center justify-center mx-auto py-16 px-4 gap-20">
        {/* Left Side */}
        <div className="md:w-1/2 text-left flex flex-col gap-4">
          <h3 className="text-4xl font-bold text-[#303a42] text-center">
            Fitur Website
          </h3>
          <p className="text-md text-[#303a42] text-center">
            Gunakan fitur yang ada untuk mempermudah pencarian anda
          </p>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 w-5/6 flex flex-col gap-10">
          <FeatureCard
            image="/icons/ic_interactive_map.png"
            title="Map Interakti"
            description="Jelajahi kost dengan peta yang interaktif"
          />
          <FeatureCard
            image="/icons/ic_search_browser.png"
            title="Pencarian Kost"
            description="Pencarian lebih mudah menggunakan fitur pencarian"
          />
          <FeatureCard
            image="/icons/ic_information_browser.png"
            title="Informasi Kost"
            description="Informasi yang lengkap tentang kost"
          />
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
