import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { supabase } from "../api/supabaseClient";
import formatDate from "../utils/dateFormatter";

function Dashboard() {
  const [stats, setStats] = useState({
    properties: 0,
    recommendations: 0,
    facilities: 0,
  });
  const [properties, setProperties] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteRecommendationId, setDeleteRecommendationId] = useState(null);
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  // Hapus rekomendasi dari database
  const deleteRecommendation = async () => {
    try {
      if (!deleteRecommendationId) return;
      const { error } = await supabase
        .from("recommendations")
        .delete()
        .eq("id", deleteRecommendationId);

      if (error) throw error;
      fetchRecommendations();
      onDeleteModalClose();
    } catch (error) {
      console.error("Error deleting recommendation:", error.message);
    }
  };

  // Buka modal konfirmasi
  const handleDeleteClick = (id) => {
    setDeleteRecommendationId(id);
    onDeleteModalOpen();
  };

  // Fetch data count for cards
  const fetchStats = async () => {
    try {
      const [
        { count: propertiesCount },
        { count: recommendationsCount },
        { count: facilitiesCount },
      ] = await Promise.all([
        supabase.from("properties").select("id", { count: "exact" }),
        supabase.from("recommendations").select("id", { count: "exact" }),
        supabase.from("facilities").select("id", { count: "exact" }),
      ]);

      setStats({
        properties: propertiesCount || 0,
        recommendations: recommendationsCount || 0,
        facilities: facilitiesCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error.message);
    }
  };

  // Fetch recommendations data
  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("recommendations")
        .select(
          "id, property_id, created_at, properties (name, city, address, property_type)"
        );
      if (error) throw error;
      console.log(data);
      setRecommendations(data || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("id, name, city, address");
      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error.message);
    }
  };

  // Add property to recommendations
  const addRecommendation = async (property) => {
    try {
      // Cek apakah data sudah ada
      const { data: existingRecommendation, error: fetchError } = await supabase
        .from("recommendations")
        .select("*")
        .eq("property_id", property.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching recommendations:", fetchError.message);
        return;
      }

      if (existingRecommendation) {
        alert("Properti ini sudah ada di rekomendasi.");
        return;
      }

      // Jika tidak ada, tambahkan rekomendasi baru
      const { error } = await supabase.from("recommendations").insert({
        property_id: property.id,
      });

      if (error) throw error;

      fetchRecommendations();
      onClose();
    } catch (error) {
      console.error("Error adding recommendation:", error.message);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchStats();
    fetchRecommendations();
  }, []);

  return (
    <>
      <Sidebar />

      {/* Main Content */}
      <div className="p-4 sm:ml-64 mt-16">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* Dashboard Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 w-full gap-6 my-6">
          <Card className="w-full p-2">
            <CardHeader className="justify-center">
              <h2 className="text-xl font-bold">Data Kos</h2>
            </CardHeader>
            <CardBody className="text-center">
              <p className="text-3xl">{stats.properties}</p>
            </CardBody>
          </Card>

          <Card className="w-full p-2">
            <CardHeader className="justify-center">
              <h2 className="text-xl font-bold">Data Rekomendasi</h2>
            </CardHeader>
            <CardBody className="text-center">
              <p className="text-3xl">{stats.recommendations}</p>
            </CardBody>
          </Card>

          <Card className="w-full p-2">
            <CardHeader className="justify-center">
              <h2 className="text-xl font-bold">Data Fasilitas</h2>
            </CardHeader>
            <CardBody className="text-center">
              <p className="text-3xl">{stats.facilities}</p>
            </CardBody>
          </Card>

          <Card className="w-full p-2">
            <CardHeader className="justify-center">
              <h2 className="text-xl font-bold">Data FAQ's</h2>
            </CardHeader>
            <CardBody className="text-center">
              <p className="text-3xl">{stats.recommendations}</p>
            </CardBody>
          </Card>
        </div>

        {/* Recommendations Table */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Rekomendasi</h2>
            <Button color="primary" onPress={onOpen}>
              Tambah Rekomendasi
            </Button>
          </div>

          {loading ? (
            <p>Loading rekomendasi...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableColumn>Nama Kost</TableColumn>
                <TableColumn>Kota</TableColumn>
                <TableColumn>Alamat</TableColumn>
                <TableColumn>Tanggal dibuat</TableColumn>
                <TableColumn>Aksi</TableColumn>
              </TableHeader>
              <TableBody>
                {recommendations.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell>{rec.properties.name}</TableCell>
                    <TableCell>{rec.properties.city}</TableCell>
                    <TableCell>{rec.properties.address}</TableCell>
                    <TableCell>{formatDate(rec.created_at)}</TableCell>
                    <TableCell>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(rec.id)}
                      >
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Add Recommendation Modal */}
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tambah Rekomendasi
              </ModalHeader>
              <ModalBody>
                <Table>
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
                            onPress={() => addRecommendation(property)}
                          >
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        backdrop="blur"
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        className="max-w-sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-center">
                Konfirmasi Hapus
              </ModalHeader>
              <ModalBody>
                <p>Apakah Anda yakin ingin menghapus rekomendasi ini?</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onDeleteModalClose}>
                  Batal
                </Button>
                <Button color="danger" onPress={deleteRecommendation}>
                  Hapus
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Dashboard;
