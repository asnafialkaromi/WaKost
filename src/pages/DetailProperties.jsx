import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import { useParams } from "react-router";
import { supabase } from "../api/supabaseClient";
import ImageGallery from "../components/ImageGallery";
import { Card, CardBody, Divider } from "@nextui-org/react";

function DetailProperties() {
  const { id } = useParams();
  const [property, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select(
          `
          id, name, city, address, price, description, 
          images (url), 
          property_facilities (facilities (name))
        `
        )
        .eq("id", id);

      if (error) {
        throw error;
      }
      console.log(data);
      setProperties(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching properties:", error.message);
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="text-center py-4">Loading...</div>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <NavBar />
        <div className="text-center py-4">Property not found</div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="max-w-5xl mx-auto p-6">
        <section className="flex flex-col md:flex-row w-full justify-center gap-4">
          <ImageGallery
            images={property[0].images}
            className="md:w-3/5 bg-slate-500:w-full"
          />
          <Card className="md:w-2/5 h-fit p-3">
            <CardBody className="">
              <h1 className="text-2xl font-bold">{property[0].name}</h1>
              <p className="text-2xl font-bold text-blue-600">
                {property[0].price.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 2,
                })}
                / bulan
              </p>
              <p className="text-xl font-bold mt-8">Kota</p>
              <p className="text-lg font-semibold text-gray-700">
                {property[0].city}
              </p>
              <p className="text-xl font-bold mt-4">Alamat</p>
              <p className="text-lg font-semibold text-gray-700">
                {property[0].address}
              </p>
            </CardBody>
          </Card>
        </section>

        <Divider className="my-6" />

        <section className="mt-6">
          <h2 className="text-2xl font-semibold">Deskripsi</h2>
          <p className="text-lg mt-2 text-gray-700">
            {property[0].description}
          </p>
        </section>

        <Divider className="my-6" />

        <section className="mt-6">
          <h3 className="text-2xl font-semibold">Fasilitas</h3>
          <ul className="list-disc pl-5 mt-2">
            {property[0].property_facilities.map((facility, index) => (
              <li className="text-lg text-gray-700" key={index}>
                {facility.facilities.name}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}

export default DetailProperties;
