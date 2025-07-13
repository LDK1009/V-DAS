import { Modal, Stack, styled } from "@mui/material";
import React from "react";
import EditFloorCount from "./EditFloorCount";
import { useEditDormitoryModalStore } from "@/store/ui/editDormitoryModalStore";

const DormitorySettingModal = () => {
  const { isEditDormitoryModalOpen, setIsEditDormitoryModalOpen } = useEditDormitoryModalStore();
  return (
    <Modal open={isEditDormitoryModalOpen} onClose={() => setIsEditDormitoryModalOpen(false)}>
      <ModalContainer>
        <EditFloorCount />
      </ModalContainer>
    </Modal>
  );
};

export default DormitorySettingModal;

const ModalContainer = styled(Stack)`
  width: 500px;
  height: 500px;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 16px;
  padding: 16px;
`;
