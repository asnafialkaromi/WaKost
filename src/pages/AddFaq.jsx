import {
  BreadcrumbItem,
  Breadcrumbs,
  Form,
  Link,
  Skeleton,
} from "@nextui-org/react";
import Sidebar from "../components/common/Sidebar";
import React, { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import {
  Button,
  Input,
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
import { Bounce, toast, ToastContainer } from "react-toastify";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { s } from "framer-motion/client";

function AddFaq() {
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [editFaq, setEditFaq] = useState(null);
  const [deleteFaqId, setDeleteFaqId] = useState(null);

  const handleDeleteClick = (id) => {
    setDeleteFaqId(id);
    onDeleteOpen();
  };

  const closeModalDelete = (faq) => {
    setDeleteFaqId(null);
    onDeleteClose();
  };

  // Fetch FAQs
  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("faqs").select("*");
      if (error) throw new Error(error.message);
      setFaqs(data || []);
    } catch (error) {
      console.error("Error fetching FAQs:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const addFaq = async (e) => {
    e.preventDefault();
    setLoadingButton(true);
    try {
      const { error } = await supabase.from("faqs").insert([newFaq]);
      if (error) throw new Error(error.message);
      fetchFaqs();
      onAddClose();
      setLoadingButton(false);
      setNewFaq({ question: "", answer: "" });
      toast.success("FAQ berhasil ditambahkan");
    } catch (error) {
      toast.error("Gagal menambahkan FAQ");
      setLoadingButton(false);
    }
  };

  const updateFaq = async (e) => {
    e.preventDefault();
    setLoadingButton(true);
    try {
      const { error } = await supabase
        .from("faqs")
        .update({ question: editFaq.question, answer: editFaq.answer })
        .eq("id", editFaq.id);

      if (error) throw new Error(error.message);
      fetchFaqs();
      onEditClose();
      setEditFaq(null);
      setLoadingButton(false);
      toast.success("FAQ berhasil diupdate");
    } catch (error) {
      toast.error("Gagal memperbarui FAQ");
      setLoadingButton(false);
    }
  };

  const deleteFaq = async (id) => {
    setLoadingButton(true);
    try {
      const { error } = await supabase.from("faqs").delete().eq("id", id);
      if (error) throw new Error(error.message);
      fetchFaqs();
      setLoadingButton(false);
      toast.success("FAQ berhasil dihapus");
      closeModalDelete();
    } catch (error) {
      console.error("Error deleting FAQ:", error.message);
      toast.error("Gagal menghapus FAQ");
      setLoadingButton(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64 mt-16">
        {/* Breadcrumbs */}
        <p className="text-2xl font-bold">Frequenly Ask Question</p>
        <div className="flex justify-between items-center my-4">
          <Breadcrumbs>
            <BreadcrumbItem>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>FAQ</BreadcrumbItem>
          </Breadcrumbs>
          <Button color="primary" onClick={onAddOpen}>
            Tambah FAQ
          </Button>
        </div>

        {/* Content goes here */}
        {/* Add FAQ Modal */}
        <Modal backdrop="blur" isOpen={isAddOpen} onClose={onAddClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Tambah FAQ
                </ModalHeader>
                <Form validationBehavior="native" onSubmit={addFaq}>
                  <ModalBody className="w-full">
                    <Input
                      isRequired
                      required
                      label="Pertanyaan"
                      placeholder="Masukkan pertanyaan"
                      errorMessage="Pertanyaan harus diisi"
                      value={newFaq.question}
                      onChange={(e) =>
                        setNewFaq((prev) => ({
                          ...prev,
                          question: e.target.value,
                        }))
                      }
                    />
                    <Input
                      isRequired
                      required
                      label="Jawaban"
                      placeholder="Masukkan jawaban"
                      errorMessage="Jawaban harus diisi"
                      value={newFaq.answer}
                      onChange={(e) =>
                        setNewFaq((prev) => ({
                          ...prev,
                          answer: e.target.value,
                        }))
                      }
                      className="mt-4"
                    />
                  </ModalBody>
                  <ModalFooter className="w-full">
                    <Button color="warning" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      color="success"
                      type="submit"
                      className="text-white"
                      isLoading={loadingButton}
                    >
                      Tambah
                    </Button>
                  </ModalFooter>
                </Form>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Edit FAQ Modal */}
        <Modal backdrop="blur" isOpen={isEditOpen} onClose={onEditClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Edit FAQ
                </ModalHeader>
                <Form validationBehavior="native" onSubmit={updateFaq}>
                  <ModalBody className="w-full">
                    <Input
                      label="Pertanyaan"
                      placeholder="Masukkan pertanyaan"
                      errorMessage="Pertanyaan harus diisi"
                      isRequired
                      value={editFaq?.question || ""}
                      onChange={(e) =>
                        setEditFaq((prev) => ({
                          ...prev,
                          question: e.target.value,
                        }))
                      }
                    />
                    <Input
                      label="Jawaban"
                      placeholder="Masukkan jawaban"
                      errorMessage="Jawaban harus diisi"
                      isRequired
                      value={editFaq?.answer || ""}
                      onChange={(e) =>
                        setEditFaq((prev) => ({
                          ...prev,
                          answer: e.target.value,
                        }))
                      }
                      className="mt-4"
                    />
                  </ModalBody>
                  <ModalFooter className="w-full">
                    <Button color="warning" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      color="success"
                      type="submit"
                      className="text-white"
                      isLoading={loadingButton}
                    >
                      Simpan
                    </Button>
                  </ModalFooter>
                </Form>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* FAQ Table */}
        {loading ? (
          <Table aria-label="FAQs Table">
            <TableHeader>
              <TableColumn>Pertanyaan</TableColumn>
              <TableColumn>Jawaban</TableColumn>
              <TableColumn>Aksi</TableColumn>
            </TableHeader>
            <TableBody>
              {Array(5)
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
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableColumn>Pertanyaan</TableColumn>
              <TableColumn>Jawaban</TableColumn>
              <TableColumn>Aksi</TableColumn>
            </TableHeader>
            <TableBody>
              {faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell>{faq.question}</TableCell>
                  <TableCell>{faq.answer}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      color="warning"
                      size="sm"
                      onPress={() => {
                        setEditFaq(faq);
                        onEditOpen();
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onPress={() => handleDeleteClick(faq.id)}
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

      <ConfirmationModal
        isOpen={isDeleteOpen}
        loading={loadingButton}
        onClose={onDeleteClose}
        onConfirm={() => deleteFaq(deleteFaqId)}
        message="Apakah Anda yakin ingin menghapus FAQ ini?"
      />

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
    </>
  );
}

export default AddFaq;
