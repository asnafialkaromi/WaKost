import { Button } from "@nextui-org/react";
import React, { useState } from "react";

function ImageGallery({ images, className }) {
  const [slideIndex, setSlideIndex] = useState(1);

  const nextSlide = (n) => {
    let newIndex = slideIndex + n;
    if (newIndex > images.length) newIndex = 1;
    if (newIndex < 1) newIndex = images.length;
    setSlideIndex(newIndex);
  };

  const currentSlide = (n) => {
    setSlideIndex(n);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Full-width images with number text */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`mySlides ${
            slideIndex === index + 1 ? "block" : "hidden"
          }`}
        >
          <div className="absolute top-0 left-0 text-white text-sm p-2">
            {index + 1} / {images.length}
          </div>
          <img
            src={image.url}
            alt={`Property Image ${index + 1}`}
            className="aspect-video rounded-lg shadow-md"
          />
        </div>
      ))}

      {/* Next and previous buttons */}
      <button
        className="absolute top-1/2 left-0 text-white font-bold text-2xl p-3 transform -translate-y-1/2 hover:bg-black/80"
        onClick={() => nextSlide(-1)}
      >
        &#10094;
      </button>
      <button
        className="absolute top-1/2 right-0 text-white font-bold text-2xl p-3 transform -translate-y-1/2 hover:bg-black/80"
        onClick={() => nextSlide(1)}
      >
        &#10095;
      </button>

      {/* Thumbnail images */}
      <div className="flex justify-center mt-4">
        {images.map((image, index) => (
          <div key={index} className="mx-1">
            <img
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              className={`cursor-pointer w-20 aspect-video hover:opacity-100 ${
                slideIndex === index + 1
                  ? "border-2 border-primary"
                  : "opacity-60"
              }`}
              onClick={() => currentSlide(index + 1)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;
