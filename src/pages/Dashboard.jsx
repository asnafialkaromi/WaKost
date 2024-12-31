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

function Dashboard() {
  const [stats, setStats] = useState({
    properties: 0,
    recommendations: 0,
  });
  const [properties, setProperties] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch data count for cards
  const fetchStats = async () => {
    try {
      const [{ count: propertiesCount }, { count: recommendationsCount }] =
        await Promise.all([
          supabase.from("properties").select("id", { count: "exact" }),
          supabase.from("recommendations").select("id", { count: "exact" }),
        ]);

      setStats({
        properties: propertiesCount || 0,
        recommendations: recommendationsCount || 0,
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
        .select("id, property_id, created_at");
      if (error) throw error;
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <Card>
            <CardHeader className="justify-center">
              <h2 className="text-xl font-bold">Total Properties</h2>
            </CardHeader>
            <CardBody className="text-center">
              <p className="text-3xl">{stats.properties}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="justify-center">
              <h2 className="text-xl font-bold">Total Recommendations</h2>
            </CardHeader>
            <CardBody className="text-center">
              <p className="text-3xl">{stats.recommendations}</p>
            </CardBody>
          </Card>
        </div>

        {/* Recommendations Table */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recommendations</h2>
            <Button color="primary" onPress={onOpen}>
              Tambah Rekomendasi
            </Button>
          </div>

          {loading ? (
            <p>Loading rekomendasi...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Properti ID</TableColumn>
                <TableColumn>Create Date</TableColumn>
              </TableHeader>
              <TableBody>
                {recommendations.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell>{rec.id}</TableCell>
                    <TableCell>{rec.property_id}</TableCell>
                    <TableCell>{rec.created_at}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Add Recommendation Modal */}
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Recommendation
              </ModalHeader>
              <ModalBody>
                <Table>
                  <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>Name</TableColumn>
                    <TableColumn>City</TableColumn>
                    <TableColumn>Address</TableColumn>
                    <TableColumn>Action</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>{property.id}</TableCell>
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
    </>
  );
}

export default Dashboard;
