import React from "react";
import { Card, CardBody, CardHeader, Skeleton } from "@nextui-org/react";

const StatsCard = ({ stats, loadingStats }) => {
  const cards = [
    { title: "Data Kos", count: stats.properties },
    { title: "Data Rekomendasi", count: stats.recommendations },
    { title: "Data Fasilitas", count: stats.facilities },
    { title: "Data FAQ's", count: stats.faqs },
  ];

  if (loadingStats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 w-full gap-6 my-6">
        {Array(4)
          .fill()
          .map((_, index) => (
            <Skeleton
              key={index}
              className="w-full h-32 p-2 bg-white shadow-md rounded-lg"
            />
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 w-full gap-6 my-6">
      {cards.map((card, index) => (
        <Card key={index} className="w-full p-2">
          <CardHeader className="justify-center">
            <h2 className="text-xl font-bold">{card.title}</h2>
          </CardHeader>
          <CardBody className="text-center">
            <p className="text-3xl">{card.count}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default StatsCard;
