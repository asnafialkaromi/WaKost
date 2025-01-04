import React, { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import {
  Button,
  link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function PropertiesTable() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
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
    setLoadingButton(true);
    try {
      const { data: images, error: imageFetchError } = await supabase
        .from("images")
        .select("url")
        .eq("property_id", selectedProperty.id);

      if (imageFetchError) {
        console.error("Error fetching images:", imageFetchError.message);
        toast.error("Gagal menghapus gambar");
        setLoadingButton(false);
        return;
      }

      if (images.length > 0) {
        const deletePromises = images.map(({ url }) => {
          const path = url.split("/property-images/")[1];
          return supabase.storage.from("property-images").remove([path]);
        });
        await Promise.all(deletePromises);
      }

      await supabase.from("properties").delete().eq("id", selectedProperty.id);
      toast.success("Properti berhasil dihapus");
      setLoadingButton(false);
      fetchProperties();
    } catch (error) {
      console.error("Error deleting property or images:", error.message);
      toast.error("Gagal menghapus properti");
    } finally {
      onClose();
      setSelectedProperty(null);
      setLoadingButton(false);
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
                <Button
                  color="danger"
                  onPress={() => deleteProperty()}
                  isLoading={loadingButton}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {loading ? (
        <Table aria-label="Properties Table">
          <TableHeader>
            <TableColumn>Nama Kost</TableColumn>
            <TableColumn>Kota</TableColumn>
            <TableColumn>Alamat</TableColumn>
            <TableColumn>Harga</TableColumn>
            <TableColumn>Aksi</TableColumn>
          </TableHeader>
          <TableBody>
            {Array(5)
              .fill()
              .map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-6 rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 rounded-lg" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
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

                  <Button
                    color="warning"
                    as={Link}
                    to={`/properties/edit/${property.id}`}
                    size="sm"
                  >
                    Edit
                  </Button>
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
