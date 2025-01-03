import React, { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { Link } from "react-router-dom";

function PropertiesTable() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("id, name, city, address, price");

      if (error) {
        throw new Error(error.message);
      }

      setProperties(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (property) => {
    setSelectedProperty(property);
    onOpen();
  };

  const deleteProperty = async () => {
    if (!selectedProperty) return;

    try {
      // Menghapus gambar dari folder storage berdasarkan property ID
      const { data: images, error: imageFetchError } = await supabase
        .from("images") // Ganti 'image' dengan nama tabel Anda
        .select("url")
        .eq("property_id", selectedProperty.id);

      if (imageFetchError) {
        console.error("Error fetching images:", imageFetchError.message);
        return;
      }

      // Menghapus file dari storage berdasarkan linkUrl
      if (images.length > 0) {
        const deletePromises = images.map(({ url }) => {
          // Mendapatkan path dari URL
          const path = url.split("/property-images/")[1]; // Contoh: "folder/image.jpg"
          return supabase.storage.from("property-images").remove([path]); // Ganti 'images' dengan nama bucket Anda
        });
        await Promise.all(deletePromises);
      }

      // Menghapus properti dari tabel
      await supabase.from("properties").delete().eq("id", selectedProperty.id);

      fetchProperties();
    } catch (error) {
      console.error("Error deleting property or images:", error.message);
    } finally {
      onClose();
      setSelectedProperty(null);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Hapus Properti
              </ModalHeader>
              <ModalBody>
                <p>Apakah anda yakin ingin menghapus property ini?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="warning" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="danger" onPress={() => deleteProperty()}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {loading ? (
        <div className="text-center py-4">Loading properties...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableColumn>Nama Kost</TableColumn>
            <TableColumn>Kots</TableColumn>
            <TableColumn>Alamat</TableColumn>
            <TableColumn>Harga</TableColumn>
            <TableColumn>Aksi</TableColumn>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>{property.name}</TableCell>
                <TableCell>{property.city}</TableCell>
                <TableCell>{property.address}</TableCell>
                <TableCell>
                  {property.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="space-x-2 w-40">
                  <Button
                    color="danger"
                    size="sm"
                    onPress={() => handleDeleteClick(property)}
                  >
                    Delete
                  </Button>
                  <Link
                    to={`/properties/edit/${property.id}`}
                    className="inline-block"
                  >
                    <Button color="warning" size="sm">
                      Edit
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default PropertiesTable;
