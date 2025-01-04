import React, { useEffect, useState } from "react";
import {
  Button,
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
} from "@nextui-org/react";
import { fetchProperties } from "../../../api/propertiesAPI";
import { addRecommendation } from "../../../api/recommendationAPI";
import { toast } from "react-toastify";

const AddRecomendationModal = ({ isOpen, onClose, onRecommendationAdded }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [error, setError] = useState(null);

  const handleAddRecommendation = async (property) => {
    setLoadingAdd(true);
    const response = await addRecommendation(property.id);
    if (response.success) {
      onRecommendationAdded(true);
      setLoadingAdd(false);
      onClose();
      toast.success(response.message);
    } else {
      toast.error(response.message);
      setLoadingAdd(false);
    }
  };

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    const response = await fetchProperties();
    if (response.success) {
      setProperties(response.data);
    } else {
      setError(response.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadProperties();
    }
  }, [isOpen]);

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Tambah Rekomendasi
        </ModalHeader>
        <ModalBody>
          {loading && (
            <Table aria-label="Properties Table">
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>City</TableColumn>
                <TableColumn>Address</TableColumn>
                <TableColumn>Action</TableColumn>
              </TableHeader>
              <TableBody>
                {Array(3)
                  .fill()
                  .map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-6 rounded-lg p-0" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 rounded-lg p-0" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 rounded-lg p-0" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 rounded-lg p-0" />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && properties.length === 0 && (
            <p>No properties found.</p>
          )}

          {!loading && !error && properties.length > 0 && (
            <Table aria-label="Properties Table">
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>City</TableColumn>
                <TableColumn>Address</TableColumn>
                <TableColumn>Action</TableColumn>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>{property.name}</TableCell>
                    <TableCell>{property.city}</TableCell>
                    <TableCell>{property.address}</TableCell>
                    <TableCell>
                      <Button
                        color="success"
                        size="sm"
                        className="text-white"
                        onPress={() => handleAddRecommendation(property)}
                        isLoading={loadingAdd}
                      >
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddRecomendationModal;
