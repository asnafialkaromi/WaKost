import { Card, CardBody, Image } from "@nextui-org/react";
import React from "react";

function FeatureCard({ image, title, description }) {
  return (
    <Card isHoverable className="flex flex-row justify-center items-center">
      {/* Left Side: Image */}
      <Image
        isBlurred
        src={image}
        alt={title}
        width={150}
        className="rounded-lg p-4"
      />

      {/* Right Side: Content */}
      <CardBody>
        <h3 className="font-bold mb-2 text-sm md:text-md">{title}</h3>
        <p className="text-gray-600 text-xs md:text-sm">{description}</p>
      </CardBody>
    </Card>
  );
}

export default FeatureCard;
