import { Card, CardBody, Chip, Image } from "@nextui-org/react";
import React from "react";
import formatToIDR from "../../utils/currencyFormatter";
import { useNavigate } from "react-router";

function CardList({ id, image, type, title, price, distance }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log(id);
    navigate(`/kost/${id}`);
  };

  return (
    <Card
      isHoverable
      isPressable
      onPress={handleCardClick}
      className="flex flex-row justify-center items-center p-2"
    >
      {/* Left Side: Image */}
      <Image
        isZoomed
        isBlurred
        src={image}
        alt={title}
        width={400}
        className="rounded-2xl aspect-video"
      />

      {/* Right Side: Content */}
      <CardBody>
        <Chip size="sm" variant="solid" color="primary" className="mb-2">
          {type}
        </Chip>
        <h3 className="font-bold mb-2 text-sm md:text-md">
          {" "}
          Kos putra bapak agus{title}
        </h3>
        <p className="text-gray-600 text-xs md:text-sm">
          Jarak Tempuh -/+ {distance} Meter
        </p>
        <p className="text-blue-600 text-md md:text-sm text-right font-semibold">
          {formatToIDR(price)}
        </p>
      </CardBody>
    </Card>
  );
}

export default CardList;
