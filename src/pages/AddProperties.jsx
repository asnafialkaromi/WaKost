import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Breadcrumbs,
  Link,
  BreadcrumbItem,
  Textarea,
  Checkbox,
  CheckboxGroup,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { supabase } from "../api/supabaseClient";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function AddProperties() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    latitude: "",
    longitude: "",
    price: "",
    description: "",
    facilities: [],
    images: null,
  });
  const [allFacilities, setAllFacilities] = useState([]);
  const [clickedLocation, setClickedLocation] = useState(null);

  useEffect(() => {
    // Fetch facilities from the database when the component mounts
    const fetchFacilities = async () => {
      const { data: facilities, error } = await supabase
        .from("facilities") // Replace with your facilities table name
        .select("id, name");

      if (error) {
        console.error("Error fetching facilities:", error.message);
      } else {
        setAllFacilities(facilities); // Update state with facilities
      }
    };

    fetchFacilities();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (selectedFacilities) => {
    setFormData({ ...formData, facilities: selectedFacilities });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Destructure formData for easier access
      const {
        name,
        location,
        latitude,
        longitude,
        price,
        description,
        facilities,
        images,
      } = formData;

      // Insert property data
      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .insert([
          {
            name,
            city: location,
            address: location,
            latitude,
            longitude,
            price,
            description,
          },
        ])
        .select()
        .single();

      if (propertyError) {
        console.error("Error inserting property:", propertyError.message);
        return;
      }

      console.log("Property added successfully:", property);

      // Insert related facilities for the property
      const facilityData = facilities.map((facility) => ({
        property_id: property.id,
        facility_id: facility, // Ensure `facility` matches the facility ID in your database
      }));

      if (facilityData.length > 0) {
        const { error: facilityError } = await supabase
          .from("property_facilities")
          .insert(facilityData);

        if (facilityError) {
          console.error("Error inserting facilities:", facilityError.message);
          return;
        }

        console.log("Facilities added successfully");
      }

      // Upload images to Supabase storage and save URLs to the database
      if (images && images.length > 0) {
        for (let image of images) {
          const { data: imageData, error: uploadError } = await supabase.storage
            .from("property-images") // Replace with your storage bucket name
            .upload(`property-${property.id}/${image.name}`, image);

          if (uploadError) {
            console.error("Error uploading image:", uploadError.message);
            continue;
          }

          const imageUrl = `${
            supabase.storage
              .from("property-images")
              .getPublicUrl(imageData.path).data.publicUrl
          }`;

          const { error: imageInsertError } = await supabase
            .from("images")
            .insert({
              property_id: property.id,
              url: imageUrl,
              is_primary: false, // Set to true for the first image or handle separately
            });

          if (imageInsertError) {
            console.error(
              "Error inserting image URL:",
              imageInsertError.message
            );
            continue;
          }

          console.log("Image added successfully:", imageUrl);
        }
      }

      alert("Property added successfully!");
      navigate("/properties"); // Navigate to properties page after successful submission
    } catch (error) {
      console.error("Error submitting form:", error.message);
      alert("Failed to add property. Please try again.");
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setClickedLocation({ latitude: lat, longitude: lng });
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toFixed(6), // Ensures a consistent precision
          longitude: lng.toFixed(6),
        }));
      },
    });
    return clickedLocation ? (
      <Marker
        position={[clickedLocation.latitude, clickedLocation.longitude]}
      ></Marker>
    ) : null;
  };

  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-grow ml-0 md:ml-64 mt-16 p-6">
        <p className="text-2xl font-bold">Tambah Kost</p>
        {/* Breadcrumbs */}
        <Breadcrumbs className="my-4">
          <BreadcrumbItem>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link href="/properties">Kost</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>Tambah Kost</BreadcrumbItem>
        </Breadcrumbs>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full gap-6 justify-center"
        >
          <div className="flex flex-col sm:flex-row justify-center gap-10 w-full">
            <div className="w-full flex flex-col gap-4">
              <Input
                label="Nama Kost"
                placeholder="Masukkan nama kost"
                name="name"
                fullWidth
                onChange={handleInputChange}
                required
              />
              <Input
                label="Kota"
                placeholder="Masukkan kota kost"
                name="location"
                fullWidth
                onChange={handleInputChange}
                required
              />
              <Input
                label="Alamat"
                placeholder="Masukkan alamat kost"
                name="address"
                fullWidth
                onChange={handleInputChange}
                required
              />
              <Input
                label="Latitude"
                placeholder="Masukkan latitude"
                name="latitude"
                type="number"
                step="0.000001"
                fullWidth
                value={formData.latitude} // Bind to formData directly
                onChange={handleInputChange}
                required
              />
              <Input
                label="Longitude"
                placeholder="Masukkan longitude"
                name="longitude"
                type="number"
                step="0.000001"
                fullWidth
                value={formData.longitude} // Bind to formData directly
                onChange={handleInputChange}
                required
              />
              <Input
                label="Harga"
                placeholder="Masukkan harga kost"
                name="price"
                type="number"
                fullWidth
                onChange={handleInputChange}
                required
              />
              <Textarea
                label="Deskripsi"
                placeholder="Masukkan deskripsi kost"
                name="description"
                fullWidth
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-full max-h-[520px] h-[72vh] z-0">
              <MapContainer
                center={[-7.4000599, 109.2316062]}
                zoom={20}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
              </MapContainer>
            </div>
          </div>

          {/* Facilities Checkbox Group */}
          <div>
            <label className="block font-medium mb-2">Facilities</label>
            <CheckboxGroup
              color="primary"
              value={formData.facilities}
              onChange={handleCheckboxChange}
            >
              {allFacilities.map((facility) => (
                <Checkbox key={facility.id} value={facility.id}>
                  {facility.name}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="images" className="block font-medium mb-2">
              Upload Images
            </label>
            <input
              id="images"
              name="images"
              type="file"
              multiple
              className="form-control"
              onChange={handleImageChange}
              required
            />
          </div>
          <Button type="submit" color="success" fullWidth>
            Submit
          </Button>
        </form>
      </div>
    </>
  );
}

export default AddProperties;
