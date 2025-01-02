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
  Select,
  SelectItem,
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
    property_type: "",
    city: "",
    address: "",
    latitude: "",
    longitude: "",
    price: "",
    description: "",
    facilities: [],
    images: [],
  });
  const [allFacilities, setAllFacilities] = useState([]);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    // Fetch facilities from the database when the component mounts
    const fetchFacilities = async () => {
      const { data: facilities, error } = await supabase
        .from("facilities") // Replace with your facilities table name
        .select("id, name, facilities_type");

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
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleRemoveImage = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedImages = formData.images.filter((_, i) => i !== index);

    setImagePreviews(updatedPreviews);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Destructure formData for easier access
      const {
        name,
        property_type,
        city,
        address,
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
            property_type,
            city,
            address,
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
        for (let index = 0; index < images.length; index++) {
          const image = images[index];

          // Ganti nama file dengan urutan indeks
          const fileName = `image-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}${image.name.slice(image.name.lastIndexOf("."))}`;

          const { data: imageData, error: uploadError } = await supabase.storage
            .from("property-images") // Replace with your storage bucket name
            .upload(`property-${property.id}/${fileName}`, image);

          if (uploadError) {
            console.error("Error uploading image:", uploadError.message);
            continue;
          }

          const imageUrl = `${
            supabase.storage
              .from("property-images")
              .getPublicUrl(imageData.path).data.publicUrl
          }`;

          const { error } = await supabase.from("images").insert({
            property_id: property.id,
            url: imageUrl,
          });

          if (error) {
            console.log("Image added error:", error);
          }

          console.log("Image added successfully:", imageUrl);
        }
      }

      alert("Property added successfully!");
      navigate("/properties"); // Navigate to properties page after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
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
          className="flex flex-col w-full gap-12 justify-center"
        >
          <div className="flex flex-col md:flex-row justify-center gap-10 w-full">
            <div className="w-full flex flex-col gap-4">
              <Input
                label="Nama Kost"
                name="name"
                placeholder="Masukkan Nama Kost"
                fullWidth
                onChange={handleInputChange}
                required
                isRequired
              />
              <Select
                label="Tipe Kost"
                name="type"
                placeholder="Pilih Tipe Kost"
                fullWidth
                onChange={handleInputChange}
                required
                isRequired
              >
                <SelectItem key="Kost Laki-Laki">Kost Laki-Laki</SelectItem>
                <SelectItem key="Kost Perempuan">Kost Perempuan</SelectItem>
                <SelectItem key="Kost Campuran">Kost Campuran</SelectItem>
              </Select>
              <Input
                label="Kota"
                name="city"
                placeholder="Masukkan Nama Kota"
                fullWidth
                onChange={handleInputChange}
                required
                isRequired
              />
              <Input
                label="Alamat"
                name="address"
                placeholder="Masukkan Alamat Kost"
                fullWidth
                onChange={handleInputChange}
                required
                isRequired
              />
              <Input
                label="Latitude"
                name="latitude"
                type="number"
                step="0.000001"
                placeholder="Masukkan Latitude"
                readOnly
                fullWidth
                value={formData.latitude}
                onChange={handleInputChange}
                required
                isRequired
              />
              <Input
                label="Longitude"
                name="longitude"
                type="number"
                step="0.000001"
                placeholder="Masukkan Longitude"
                readOnly
                fullWidth
                value={formData.longitude}
                onChange={handleInputChange}
                required
                isRequired
              />
              <Input
                label="Harga"
                name="price"
                type="number"
                placeholder="Masukkan Harga"
                fullWidth
                onChange={handleInputChange}
                required
                isRequired
              />
              <Textarea
                label="Deskripsi"
                name="description"
                placeholder="Masukkan Deskripsi Kost"
                fullWidth
                onChange={handleInputChange}
                required
                isRequired
                size="lg"
              />
            </div>
            <div className="w-full max-h-[620px] h-[80vh] z-0">
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-4">Fasilitas Kamar</h3>
              <CheckboxGroup
                color="primary"
                value={formData.facilities}
                onChange={handleCheckboxChange}
              >
                {allFacilities
                  .filter((facility) => facility.facilities_type === "Kamar")
                  .map((facility) => (
                    <Checkbox key={facility.id} value={facility.id}>
                      {facility.name}
                    </Checkbox>
                  ))}
              </CheckboxGroup>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Fasilitas Umum</h3>
              <CheckboxGroup
                color="primary"
                value={formData.facilities}
                onChange={handleCheckboxChange}
              >
                {allFacilities
                  .filter((facility) => facility.facilities_type === "Umum")
                  .map((facility) => (
                    <Checkbox key={facility.id} value={facility.id}>
                      {facility.name}
                    </Checkbox>
                  ))}
              </CheckboxGroup>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Upload Images</h3>
            <input
              id="images"
              name="images"
              type="file"
              multiple
              className="form-control"
              onChange={handleImageChange}
            />
            <div className="flex flex-wrap gap-4 mt-4">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="w-52 aspect-video rounded-md shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
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
