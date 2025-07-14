import { Modal, Stack, styled, Typography } from "@mui/material";
import React from "react";
import { useEditDormitoryModalStore } from "@/store/ui/editDormitoryModalStore";
import SelectUseFloor from "./SelectUseFloor";

const DormitorySettingModal = () => {
  const { isEditDormitoryModalOpen, setIsEditDormitoryModalOpen } = useEditDormitoryModalStore();
  return (
    <Modal open={isEditDormitoryModalOpen} onClose={() => setIsEditDormitoryModalOpen(false)}>
      <ModalContainer>
        <Typography variant="h6" textAlign="center">
          층 선택
        </Typography>
        <SelectUseFloor />
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
  padding: 24px;
`;
