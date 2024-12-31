import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import { useParams } from "react-router";
import { supabase } from "../api/supabaseClient";
import ImageGallery from "../components/ImageGallery";
import { Card, CardBody, Chip, Divider } from "@nextui-org/react";
import Footer from "../components/Footer";
import formatToIDR from "../utils/currencyFormatter";

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
          id, name, city, address, price, description, property_type,
          images (url), 
          property_facilities (facilities (name, facilities_type, icon_url))
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
      <main className="max-w-7xl mx-auto p-6">
        <section className="flex flex-col lg:flex-row w-full justify-center gap-4">
          <ImageGallery
            images={property[0].images}
            className="md:w-full bg-slate-500:w-full"
          />
          <Card className="md:w-full h-fit p-2">
            <CardBody className="">
              <Chip color="primary" variant="solid" size="md">
                {property[0].property_type}
              </Chip>
              <h1 className="text-2xl md:text-md lg:text-2xl font-bold mt-4">
                {property[0].name}
              </h1>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {formatToIDR(property[0].price)}/ bulan
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
          <h2 className="text-2xl font-semibold">Fasilitas Kamar</h2>
          <div className="grid sm:grid-cols-2 px-2 mt-2">
            {property[0].property_facilities
              .filter(
                (facility) => facility.facilities.facilities_type === "Kamar"
              )
              .map((facility, index) => (
                <li
                  className="text-lg flex items-center"
                  key={`kamar-${index}`}
                >
                  <img
                    src={`${facility.facilities.icon_url}`}
                    alt={`${facility.facilities.name} icon`}
                    className="w-6 h-6 mr-2 mb-2 mt-2"
                  />
                  {facility.facilities.name}
                </li>
              ))}
          </div>
        </section>

        <Divider className="my-6" />

        <section className="mt-6">
          <h2 className="text-2xl font-semibold">Fasilitas Umum</h2>
          <div className="grid sm:grid-cols-2 pl-2 mt-2">
            {property[0].property_facilities
              .filter(
                (facility) => facility.facilities.facilities_type === "Umum"
              )
              .map((facility, index) => (
                <li
                  className="text-lg flex items-center"
                  key={`kamar-${index}`}
                >
                  <img
                    src={`${facility.facilities.icon_url}`}
                    alt={`${facility.facilities.name} icon`}
                    className="w-6 h-6 mr-2 mb-2 mt-2"
                  />
                  {facility.facilities.name}
                </li>
              ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default DetailProperties;
