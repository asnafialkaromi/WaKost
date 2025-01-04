import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  loading,
  onConfirm,
  message = "Apakah Anda yakin ingin melakukan tindakan ini?",
}) => {
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-sm"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-center">Konfirmasi</ModalHeader>
            <ModalBody>
              <p>{message}</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Batal
              </Button>
              <Button color="danger" onPress={onConfirm} isLoading={loading}>
                Ya
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
