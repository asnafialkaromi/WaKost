import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Image,
  Link,
} from "@nextui-org/react";
import React from "react";
import formatToIDR from "../../utils/currencyFormatter";
import { useNavigate } from "react-router-dom";

function RecomendationCard({ id, title, type, price, city, image }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log(id);
    navigate(`/kost/${id}`);
  };

  return (
    <Card
      isHoverable
      isPressable
      className="pb-4 w-fit"
      onPress={handleCardClick}
    >
      <CardBody className="max-w-xs">
        <div className="w-full">
          <Image
            alt={title}
            className=" aspect-video rounded-xl max-w-sm w-full"
            src={image}
          />
        </div>
      </CardBody>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start max-w-xs">
        <Chip size="sm" variant="solid" color="primary" className="mb-2">
          {type}
        </Chip>
        <p className="text-left font-bold text-ellipsis overflow-hidden w-full">
          {title}
        </p>
        <small className="text-default-500">{city}</small>
        <p className="text-sm font-bold mt-2 text-blue-700">
          {formatToIDR(price)} /bulan
        </p>
      </CardHeader>
    </Card>
  );
}

export default RecomendationCard;
