import React, { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import {
  Avatar,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import Sidebar from "../components/SideBar";

const Facility = () => {
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState(null);

  const [newFacility, setNewFacility] = useState({ name: "", description: "" });
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("facilities")
        .select("id, name, facilities_type, icon_url");

      if (error) {
        throw new Error(error.message);
      }

      setFacilities(data || []);
    } catch (error) {
      console.error("Error fetching facilities:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (facility) => {
    setSelectedFacility(facility);
    onDeleteOpen();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setIconFile(null);
    setIconPreview(null);
  };

  const uploadIcon = async () => {
    if (!iconFile) return null;

    const fileName = `${Date.now()}_${iconFile.name}`;
    const { data, error } = await supabase.storage
      .from("property-images")
      .upload(`Icons/${fileName}`, iconFile);

    if (error) throw new Error(error.message);

    const imageUrl = `${
      supabase.storage.from("property-images").getPublicUrl(data.path).data
        .publicUrl
    }`;

    return `${imageUrl}`;
  };

  const addFacility = async () => {
    try {
      const uploadedIconUrl = await uploadIcon();
      const { error } = await supabase.from("facilities").insert([
        {
          name: newFacility.name,
          facilities_type: newFacility.facilities_type,
          icon_url: uploadedIconUrl,
        },
      ]);

      if (error) throw new Error(error.message);

      fetchFacilities();
      onAddClose();
      setNewFacility({ name: "", facilities_type: "", icon_url: "" });
      setIconFile(null);
      setIconPreview(null);
    } catch (error) {
      console.error("Error adding facility:", error.message);
    }
  };

  const deleteFacility = async () => {
    if (!selectedFacility) return;

    try {
      await supabase.from("facilities").delete().eq("id", selectedFacility.id);
      fetchFacilities();
    } catch (error) {
      console.error("Error deleting facility:", error.message);
    } finally {
      onDeleteClose();
      setSelectedFacility(null);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64 mt-16">
        {/* Breadcrumbs */}
        <p className="text-2xl font-bold">Fasilitas</p>
        <div className="flex justify-between items-center my-4">
          <Breadcrumbs>
            <BreadcrumbItem>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>Fasilitas</BreadcrumbItem>
          </Breadcrumbs>
          <Button color="primary" onClick={onAddOpen}>
            Tambah Fasilitas
          </Button>
        </div>

        {/*Content*/}
        <Modal backdrop="blur" isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Hapus Fasilitas
                </ModalHeader>
                <ModalBody>
                  <p>Apakah Anda yakin ingin menghapus fasilitas ini?</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="warning" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="danger" onPress={() => deleteFacility()}>
                    Delete
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Modal Tambah */}
        <Modal backdrop="blur" isOpen={isAddOpen} onClose={onAddClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Tambah Fasilitas
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <Input
                      label="Nama Fasilitas"
                      placeholder="Masukkan nama fasilitas"
                      required
                      isRequired
                      value={newFacility.name}
                      onChange={(e) =>
                        setNewFacility((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                    <Select
                      label="Tipe Fasilitas"
                      placeholder="Pilih tipe fasilitas"
                      required
                      isRequired
                      onChange={(e) =>
                        setNewFacility((prev) => ({
                          ...prev,
                          facilities_type: e.target.value,
                        }))
                      }
                    >
                      <SelectItem key="Kamar">Fasilitas Kamar</SelectItem>
                      <SelectItem key="Umum">Fasilitas Umum</SelectItem>
                    </Select>

                    <div>
                      <h3 className="text-md font-semibold mb-4">
                        Upload Icon
                      </h3>
                      <input
                        id="icon"
                        name="icon"
                        type="file"
                        className="form-control"
                        onChange={handleImageChange}
                      />
                      {iconPreview && (
                        <div className="relative mt-4">
                          <img
                            src={iconPreview}
                            alt="Icon Preview"
                            className="w-16 h-16 aspect-square rounded-md shadow-md"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 left-14 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            &times;
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="warning" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="success"
                    type="submit"
                    onPress={() => addFacility()}
                    className="text-white"
                  >
                    Tambah
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {loading ? (
          <div className="text-center py-4">Loading facilities...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableColumn>Nama Fasilitas</TableColumn>
              <TableColumn>Tipe Fasilitas</TableColumn>
              <TableColumn>Aksi</TableColumn>
            </TableHeader>
            <TableBody>
              {facilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell className="flex items-center gap-4">
                    <Avatar
                      src={facility.icon_url}
                      size="md"
                      radius="sm"
                      className="bg-opacity-0"
                    />
                    {facility.name}
                  </TableCell>
                  <TableCell>{facility.facilities_type}</TableCell>
                  <TableCell className="space-x-2 w-40">
                    <Button
                      color="danger"
                      size="sm"
                      onPress={() => handleDeleteClick(facility)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
};

export default Facility;
