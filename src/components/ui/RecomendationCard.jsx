import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import React from "react";

function RecomendationCard() {
  return (
    <Card isHoverable isPressable className="pb-4 md:w-3/4 w-80">
      <CardBody className="overflow-visible">
        <div className="w-full">
          <Image
            alt="Card thumnail"
            className="object-cover rounded-xl"
            src="https://nextui.org/images/hero-card-complete.jpeg"
          />
        </div>
      </CardBody>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">Daily Mix</p>
        <small className="text-default-500">12 Tracks</small>
        <h4 className="font-bold text-large">Frontend Radio</h4>
      </CardHeader>
    </Card>
  );
}

export default RecomendationCard;
