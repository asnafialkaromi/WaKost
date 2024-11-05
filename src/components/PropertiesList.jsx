import React, { useEffect, useState } from "react";
import { fetchProperties } from "../api/properties";

const PropertiesList = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties().then(setProperties);
    console.log(properties);
  }, []);

  return (
    <div>
      <h1>Daftar Kost</h1>
      {properties.map((property) => (
        <div key={property.id}>
          <h2>{property.name}</h2>
          <p>{property.description}</p>
          <p>Harga per bulan: Rp {property.price_per_month}</p>
          <p>Alamat: {property.address}</p>
          <p>
            Lokasi: {property.latitude}, {property.longitude}
          </p>
          <p>Kategori: {property.categories.name}</p>
          <p>Pemilik: {property.owners.name}</p>
          <p>Telepon: {property.owners.phone}</p>
          <p>Email: {property.owners.email}</p>
          <p>Fasilitas:</p>
          <ul>
            {property.property_facilities.map((facility) => (
              <li key={facility.facilities.id}>{facility.facilities.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PropertiesList;
