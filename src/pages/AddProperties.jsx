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
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex flex-col flex-grow ml-64">
        {/* Breadcrumbs */}
        <div className="p-6">
          <Breadcrumbs>
            <BreadcrumbItem>
              <Link href="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link href="/properties">Properties</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>Add Property</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className="flex flex-row px-6 pb-6 justify-center gap-10 w-full">
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col w-1/2 gap-6">
            <Input
              label="Property Name"
              placeholder="Enter property name"
              name="name"
              fullWidth
              onChange={handleInputChange}
              required
            />
            <Input
              label="Location"
              placeholder="Enter property location"
              name="location"
              fullWidth
              onChange={handleInputChange}
              required
            />
            <Input
              label="Latitude"
              placeholder="Enter latitude"
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
              placeholder="Enter longitude"
              name="longitude"
              type="number"
              step="0.000001"
              fullWidth
              value={formData.longitude} // Bind to formData directly
              onChange={handleInputChange}
              required
            />
            <Input
              label="Price"
              placeholder="Enter property price"
              name="price"
              type="number"
              fullWidth
              onChange={handleInputChange}
              required
            />
            <Textarea
              label="Description"
              placeholder="Enter property description"
              name="description"
              fullWidth
              onChange={handleInputChange}
              required
            />

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
          <div className="w-1/2 h-[80vh]">
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
      </div>
    </div>
  );
}

export default AddProperties;
