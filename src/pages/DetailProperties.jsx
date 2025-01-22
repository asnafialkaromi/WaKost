import React, { useEffect, useState } from "react";
import NavBar from "../components/common/NavBar";
import { useParams } from "react-router";
import { supabase } from "../api/supabaseClient";
import ImageGallery from "../components/ImageGallery";
import { Card, CardBody, Chip, Divider, Skeleton } from "@nextui-org/react";
import Footer from "../components/Footer";
import formatToIDR from "../utils/currencyFormatter";

function DetailProperties() {
  const { id } = useParams();
  const [property, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    console.log(id);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select(
          `
          id, name, city, address, price, latitude, longitude, description, property_type, telp, distance,
          images (url), 
          property_facilities (facilities (name, facilities_type, icon_url))
        `
        )
        .eq("id", id);

      if (error) {
        throw error;
      }

      setProperties(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching properties:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <>
        <NavBar />
        <main className="max-w-7xl mx-auto p-6">
          <section className="flex flex-col lg:flex-row w-full justify-center gap-4">
            {/* Image Gallery Skeleton */}
            <div className="md:w-full w-full aspect-video">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>

            {/* Property Details Skeleton */}
            <Card className="md:w-full h-fit p-2">
              <CardBody>
                <Skeleton className="mb-4 w-1/3 h-8 rounded-lg" />
                <Skeleton className="mb-4 w-full h-8 rounded-lg" />
                <Skeleton className="mb-4 w-2/3 h-8 rounded-lg" />
                <Skeleton className="mb-4 w-1/2 h-8 rounded-lg" />
                <Skeleton className="mb-4 w-2/5 h-8 rounded-lg" />
                <Skeleton className="mb-4 w-1/3 h-8 rounded-lg" />
                <Skeleton className="mb-4 w-3/5 h-8 rounded-lg" />
              </CardBody>
            </Card>
          </section>

          <Divider className="my-6" />

          <section className="mt-6">
            <Skeleton className="mb-4 w-full h-8 rounded-lg" />
            <Skeleton className="mb-4 w-full h-8 rounded-lg" />
            <Skeleton className="mb-4 w-full h-8 rounded-lg" />
            <Skeleton className="mb-4 w-full h-8 rounded-lg" />
          </section>

          <Divider className="my-6" />

          <section className="mt-6">
            <Skeleton className="mb-4 w-full h-8 rounded-lg" />
            <div className="grid sm:grid-cols-2 px-2 mt-2 gap-2">
              {Array(4)
                .fill()
                .map((_, index) => (
                  <div className="flex items-center" key={`kamar-${index}`}>
                    <Skeleton className="mb-4 w-full h-8 rounded-lg" />
                    <Skeleton className="mb-4 w-full h-8 rounded-lg" />
                  </div>
                ))}
            </div>
          </section>

          <Divider className="my-6" />

          <section className="mt-6">
            <Skeleton width="30%" height={30} className="mb-4" />
            <div className="grid sm:grid-cols-2 px-2 mt-2 gap-2">
              {Array(4)
                .fill()
                .map((_, index) => (
                  <div className="flex items-center" key={`umum-${index}`}>
                    <Skeleton className="mb-4 w-full h-8 rounded-full" />
                    <Skeleton className="w-full h-8" />
                  </div>
                ))}
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (!property || property.length === 0) {
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
              <h1 className="text-lg md:text-2xl md:text-md lg:text-2xl font-bold mt-4">
                {property[0].name}
              </h1>
              <p className="text-lg md:text-2xl font-bold text-blue-600 mt-2">
                {formatToIDR(property[0].price)}/ bulan
              </p>
              <p className="text-md md:text-xl font-bold mt-4 md:mt-8">Kota</p>
              <p className="text-sm md:text-lg font-semibold text-gray-700">
                {property[0].city}
              </p>
              <p className="text-md md:text-xl font-bold mt-4">Alamat</p>
              <p className="text-sm md:text-lg font-semibold text-gray-700">
                {property[0].address}
              </p>
            </CardBody>
          </Card>
        </section>

        <Divider className="my-6" />

        <section className="mt-6">
          <h2 className="text-lg md:text-2xl font-semibold">Deskripsi</h2>
          <p className="text-sm md:text-lg mt-2 text-gray-700">
            {property[0].description}
          </p>
        </section>

        <Divider className="my-6" />

        <section className="mt-6">
          <h2 className="text-lg md:text-2xl font-semibold">Fasilitas Kamar</h2>
          <div className="grid sm:grid-cols-2 px-2 mt-2">
            {property[0].property_facilities
              .filter(
                (facility) => facility.facilities.facilities_type === "Kamar"
              )
              .map((facility, index) => (
                <li
                  className="text-sm md:text-lg flex items-center"
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
          <h2 className="text-lg md:text-2xl font-semibold">Fasilitas Umum</h2>
          <div className="grid sm:grid-cols-2 pl-2 mt-2">
            {property[0].property_facilities
              .filter(
                (facility) => facility.facilities.facilities_type === "Umum"
              )
              .map((facility, index) => (
                <li
                  className="text-sm md:text-lg flex items-center"
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
          <h2 className="text-lg md:text-2xl font-semibold mb-4">
            Jarak ke Universitas
          </h2>
          <li className="text-sm md:text-lg flex items-center">
            <img
              src="../../images/img_logo-amikom.png"
              alt="Icon Whatsapp"
              className="w-8 h-8 mr-4 mb-2 mt-2"
            />
            {`${property[0].distance} Meter`}
          </li>
        </section>

        <Divider className="my-6" />

        <section className="mt-6">
          <h2 className="text-lg md:text-2xl font-semibold mb-4">
            Kontak Pemilik
          </h2>
          <li className="text-sm md:text-lg flex items-center">
            <img
              src="../../icons/ic_whatsapp.png"
              alt="Icon Whatsapp"
              className="w-6 h-6 mr-2 mb-2 mt-2"
            />
            {`0${property[0].telp}`}
          </li>
        </section>

        <Divider className="my-6" />

        <section className="mt-6">
          <h2 className="text-lg md:text-2xl font-semibold mb-4">Google Map</h2>
          <iframe
            src={`https://maps.google.com/maps?q=${property[0].latitude},${property[0].longitude}&z=18&output=embed`}
            width="100%"
            height="600"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default DetailProperties;
