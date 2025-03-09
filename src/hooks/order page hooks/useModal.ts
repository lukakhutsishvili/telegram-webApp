import { useState } from "react";

const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [componentParcelErrorModal, setComponentParcelErrorModal] =
    useState(false);

  const openCancellationModal = () => setIsModalOpen(true);
  const closeCancellationModal = () => setIsModalOpen(false);

  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  const openComponentParcelErrorModal = () =>
    setComponentParcelErrorModal(true);
  const closeComponentParcelErrorModal = () =>
    setComponentParcelErrorModal(false);

  return {
    isModalOpen,
    setIsModalOpen,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    openCancellationModal,
    closeCancellationModal,
    openConfirmModal,
    closeConfirmModal,
    componentParcelErrorModal,
    openComponentParcelErrorModal,
    closeComponentParcelErrorModal,
  };
};

export default useModal;
