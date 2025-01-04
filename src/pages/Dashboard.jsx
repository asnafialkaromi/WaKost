import React, { Fragment, useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useDashboardData } from "../hooks/useDashboardData";
import Sidebar from "../components/common/Sidebar";
import StatsCard from "../components/specific/dashboard/StatsCard";
import RecommendationTable from "../components/specific/dashboard/RecommendationsTable";
import AddRecomendationModal from "../components/specific/dashboard/AddRecommendationModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import {
  deleteRecommendation,
  fetchRecommendations,
} from "../api/recommendationAPI";
import { Bounce, toast, ToastContainer } from "react-toastify";
import TableSkeletonRecommendation from "../components/specific/dashboard/TableSkeletonRecommendation";

function Dashboard() {
  const [recommendations, setRecommendations] = useState([]);
  const [deleteRecommendationId, setDeleteRecommendationId] = useState(null);
  const { stats, loadingStats } = useDashboardData();
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteRecommendation = async () => {
    if (!deleteRecommendationId) return;
    setLoadingDelete(true);
    const response = await deleteRecommendation(deleteRecommendationId);
    if (response.success) {
      toast.success(response.message);
      setDeleteRecommendationId(null);
      setLoadingDelete(false);
      loadRecommendations();
    } else {
      toast.error(response.message);
      setLoadingDelete(false);
    }
    closeDeleteModal();
  };

  const handleDeleteClick = (id) => {
    setDeleteRecommendationId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteRecommendationId(null);
    setIsDeleteModalOpen(false);
  };

  const loadRecommendations = async () => {
    setLoading(true);
    const response = await fetchRecommendations();

    if (response.success) {
      setRecommendations(response.data);
    } else {
      toast.error(response.message);
    }
    setLoading(false);
  };

  const updateRecommendationData = (success) => {
    if (success) {
      loadRecommendations();
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="p-4 sm:ml-64 mt-16 w-full">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <StatsCard stats={stats} loadingStats={loadingStats} />
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Rekomendasi</h2>
            <Button color="primary" onClick={() => setIsAddModalOpen(true)}>
              Tambah Rekomendasi
            </Button>
          </div>
          {loading ? (
            <TableSkeletonRecommendation />
          ) : (
            <RecommendationTable
              loading={loadingDelete}
              recommendations={recommendations}
              onDeleteClick={handleDeleteClick}
            />
          )}
        </div>
        <AddRecomendationModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onRecommendationAdded={updateRecommendationData}
        />
      </main>
      <Fragment>
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          loading={loadingDelete}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteRecommendation}
          message="Apakah Anda yakin ingin menghapus rekomendasi ini?"
        />
      </Fragment>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
}

export default Dashboard;
