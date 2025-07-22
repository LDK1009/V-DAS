import { Button, Modal, Stack, styled, Typography } from "@mui/material";
import React from "react";
import { useEditDormitoryModalStore } from "@/store/ui/editDormitoryModalStore";
import SelectUseFloor from "./SelectUseFloor";
import { mixinFlex, mixinMuiButtonNoShadow } from "@/styles/mixins";
import SettingMaxPeopleCount from "./SettingMaxPeopleCount";

const DormitorySettingModal = () => {
  const { isEditDormitoryModalOpen, setIsEditDormitoryModalOpen } = useEditDormitoryModalStore();
  return (
    <Modal open={isEditDormitoryModalOpen} onClose={() => setIsEditDormitoryModalOpen(false)}>
      <ModalContainer>
        <Wrapper>
          <Typography variant="h6" textAlign="center">
            1. 사용 층 선택
          </Typography>
          <SelectUseFloor />
        </Wrapper>
        <Wrapper>
          <Typography variant="h6" textAlign="center">
            2.최대 인원 설정
          </Typography>
          <SettingMaxPeopleCount />
        </Wrapper>
        <SaveButton variant="contained" onClick={() => setIsEditDormitoryModalOpen(false)}>
          저장
        </SaveButton>
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
  padding: 48px 32px;
  row-gap: 32px;
`;

const Wrapper = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  row-gap: 8px;
`;

const SaveButton = styled(Button)`
  ${mixinMuiButtonNoShadow}
  color: ${({ theme }) => theme.palette.text.white};
`;
