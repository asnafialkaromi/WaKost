import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import React from "react";

function RecomendationCard({ title, description, image }) {
  return (
    <Card isHoverable isPressable className="pb-4 md:w-3/4 w-80">
      <CardBody className="overflow-visible">
        <div className="w-full">
          <Image
            alt={title}
            className="object-cover rounded-xl max-w-md max-h-md w-full"
            src={image || "https://via.placeholder.com/300"}
          />
        </div>
      </CardBody>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">{title}</p>
        <small className="text-default-500">{description}</small>
      </CardHeader>
    </Card>
  );
}

export default RecomendationCard;
