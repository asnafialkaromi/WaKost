import React, { useState } from "react";
import RecomendationCard from "../ui/RecomendationCard";

function RecommendationCarrousel({ recommendations }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === recommendations.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? recommendations.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full h-96 max-w-7xl mx-auto overflow-hidden">
      {/* Carousel Content */}
      <div className="flex w-80 transition-transform duration-500">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className="flex-shrink-0 w-full"
            style={{ flexBasis: "100%" }}
          >
            <div data-aos="fade-up">
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
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 w-10 transform -translate-y-1/2 bg-slate-100 text-black p-2 rounded-full"
      >
        &#8592;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 w-10 transform -translate-y-1/2 bg-slate-100 text-black p-2 rounded-full"
      >
        &#8594;
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {recommendations.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-black" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default RecommendationCarrousel;
