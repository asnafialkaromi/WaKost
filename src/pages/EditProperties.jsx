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
import { useParams, useNavigate } from "react-router-dom";
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

function EditProperties() {
  const { id } = useParams(); // Get property ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    city: "",
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
  const [loading, setLoading] = useState(true);

  // Fetch property data and facilities on component mount
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        // Fetch property details
        const { data: property, error: propertyError } = await supabase
          .from("properties")
          .select(
            `
              id, name, city, address, latitude, longitude, price, description,
              property_facilities (facility_id)
            `
          )
          .eq("id", id)
          .single();

        if (propertyError) {
          console.error(
            "Error fetching property details:",
            propertyError.message
          );
          navigate("/properties");
          return;
        }

        // Fetch facilities
        const { data: facilities, error: facilitiesError } = await supabase
          .from("facilities")
          .select("id, name");

        if (facilitiesError) {
          console.error("Error fetching facilities:", facilitiesError.message);
          return;
        }

        setFormData({
          ...formData,
          name: property.name,
          city: property.city,
          address: property.address,
          latitude: property.latitude,
          longitude: property.longitude,
          price: property.price,
          description: property.description,
          facilities: property.property_facilities.map((pf) => pf.facility_id),
        });
        setAllFacilities(facilities);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchPropertyDetails();
  }, [id, navigate]);

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
    try {
      const {
        name,
        city,
        address,
        latitude,
        longitude,
        price,
        description,
        facilities,
        images,
      } = formData;

      // Update property details
      const { error: updateError } = await supabase
        .from("properties")
        .update({
          name,
          city,
          address,
          latitude,
          longitude,
          price,
          description,
        })
        .eq("id", id);

      if (updateError) {
        console.error("Error updating property:", updateError.message);
        return;
      }

      // Update facilities
      await supabase.from("property_facilities").delete().eq("property_id", id);
      const facilityData = facilities.map((facilityId) => ({
        property_id: id,
        facility_id: facilityId,
      }));
      if (facilityData.length > 0) {
        await supabase.from("property_facilities").insert(facilityData);
      }

      alert("Property updated successfully!");
      navigate("/properties");
    } catch (error) {
      console.error("Error updating property:", error.message);
      alert("Failed to update property. Please try again.");
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setClickedLocation({ latitude: lat, longitude: lng });
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toFixed(6),
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

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="flex flex-col flex-grow ml-0 md:ml-64 mt-24 items-center">
          <p className="text-2xl font-bold">Loading...</p>
        </div>
      </>
    );
  }
  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-grow ml-0 md:ml-64 mt-16 p-6">
        <p className="text-2xl font-bold">Edit Properties</p>
        <Breadcrumbs className="my-4">
          <BreadcrumbItem>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link href="/properties">Properties</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>Edit Property</BreadcrumbItem>
        </Breadcrumbs>

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
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Kota"
                placeholder="Masukkan kota kost"
                name="city"
                fullWidth
                value={formData.city}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Alamat"
                placeholder="Masukkan alamat kost"
                name="address"
                fullWidth
                value={formData.address}
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
                value={formData.latitude}
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
                value={formData.longitude}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Harga"
                placeholder="Masukkan harga kost"
                name="price"
                type="number"
                fullWidth
                value={formData.price}
                onChange={handleInputChange}
                required
              />
              <Textarea
                label="Deskripsi"
                placeholder="Masukkan deskripsi kost"
                name="description"
                fullWidth
                value={formData.description}
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
          <Button
            type="submit"
            color="success"
            fullWidth
            onPress={handleSubmit}
          >
            Submit
          </Button>
        </form>
      </div>
    </>
  );
}

export default EditProperties;
