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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
  const { id } = useParams();
  const navigate = useNavigate();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagePreviews2, setImagePreviews2] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [onConfirmDelete, setOnConfirmDelete] = useState(null);

  const openModal = (imageUrl, onConfirm) => {
    setSelectedImageUrl(imageUrl);
    setOnConfirmDelete(() => onConfirm);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageUrl(null);
    setOnConfirmDelete(null);
  };

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
              id, name, property_type, city, address, latitude, longitude, price, description,
              property_facilities (facility_id),images (url)
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
          .select("id, name, facilities_type");

        if (facilitiesError) {
          console.error("Error fetching facilities:", facilitiesError.message);
          return;
        }

        const imageUrls = property.images
          ? property.images.map((img) => img.url)
          : [];

        setFormData({
          ...formData,
          name: property.name,
          property_type: property.property_type,
          city: property.city,
          address: property.address,
          latitude: property.latitude,
          longitude: property.longitude,
          price: property.price,
          description: property.description,
          facilities: property.property_facilities.map((pf) => pf.facility_id),
        });
        setAllFacilities(facilities);
        setImagePreviews(imageUrls);
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
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews2(previews);
  };

  const handleRemoveImage = (index, previewType, imageUrl) => {
    if (previewType === "images") {
      // Buka modal untuk konfirmasi penghapusan
      openModal(imageUrl, () => {
        // Setelah konfirmasi, hapus gambar dari database dan state
        handleDeleteImageFromDatabase(imageUrl);
        setImagePreviews((prevPreviews) =>
          prevPreviews.filter((_, i) => i !== index)
        );
      });
    } else if (previewType === "images2") {
      setImagePreviews2((prevPreviews) =>
        prevPreviews.filter((_, i) => i !== index)
      );
    }
  };

  const handleDeleteImageFromDatabase = async (imageUrl) => {
    try {
      // Extract file path from the image URL
      const filePath = imageUrl.split("/").slice(-2).join("/");

      // Delete the file from Supabase Storage
      const { error: storageError } = await supabase.storage
        .from("property-images") // Replace with your storage bucket name
        .remove([filePath]);

      if (storageError) {
        console.error(
          "Error deleting image from storage:",
          storageError.message
        );
        alert("Failed to delete image from storage.");
        return;
      }

      // Delete the image record from the database
      const { error: dbError } = await supabase
        .from("images")
        .delete()
        .eq("url", imageUrl);

      if (dbError) {
        console.error("Error deleting image from database:", dbError.message);
        alert("Failed to delete image from database.");
        return;
      }
    } catch (error) {
      console.error("Error deleting image:", error.message);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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

      console.log("Submitting Form Data:", formData);
      // Update property details
      const { data: property, error } = await supabase
        .from("properties")
        .update({
          name,
          property_type,
          city,
          address,
          latitude,
          longitude,
          price,
          description,
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating property:", error);
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

      if (images && images.length > 0) {
        for (let index = 0; index < images.length; index++) {
          const image = images[index];

          // Ganti nama file dengan urutan indeks
          const fileName = `image-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}${image.name.slice(image.name.lastIndexOf("."))}`;

          const { data: imageData, error: uploadError } = await supabase.storage
            .from("property-images") // Replace with your storage bucket name
            .upload(`property-${id}/${fileName}`, image);

          console.log("Image data:", fileName);

          if (uploadError) {
            console.error("Error uploading image:", uploadError.message);

            return;
          }

          const imageUrl = `${
            supabase.storage
              .from("property-images")
              .getPublicUrl(imageData.path).data.publicUrl
          }`;

          const { error } = await supabase.from("images").insert({
            property_id: id,
            url: imageUrl,
          });

          if (error) {
            console.log("Image added error:", error);
          }

          console.log("Image added successfully:", imageUrl);
        }
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
      <Modal backdrop="blur" isOpen={isModalOpen} onClose={closeModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Hapus Gambar
              </ModalHeader>
              <ModalBody>
                <p>Apakah Anda yakin ingin menghapus gambar ini?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="warning" variant="light" onPress={closeModal}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    if (onConfirmDelete) onConfirmDelete();
                    closeModal();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
          className="flex flex-col w-full gap-12 justify-center"
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
                isRequired
              />
              <Select
                label="Tipe Kost"
                name="property_type"
                placeholder="Pilih Tipe Kost"
                fullWidth
                selectedKeys={[formData.property_type]}
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
                placeholder="Masukkan kota kost"
                name="city"
                fullWidth
                value={formData.city}
                onChange={handleInputChange}
                required
                isRequired
              />
              <Input
                label="Alamat"
                placeholder="Masukkan alamat kost"
                name="address"
                fullWidth
                value={formData.address}
                onChange={handleInputChange}
                required
                isRequired
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
                isRequired
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
                isRequired
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
                isRequired
              />
              <Textarea
                label="Deskripsi"
                placeholder="Masukkan deskripsi kost"
                name="description"
                fullWidth
                value={formData.description}
                onChange={handleInputChange}
                isRequired
                required
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
                    onClick={() => handleRemoveImage(index, "images", src)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {imagePreviews2.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="w-52 aspect-video rounded-md shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index, "images2")}
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

export default EditProperties;
