import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { useEditDormitoryModalStore } from "@/store/ui/editDormitoryModalStore";
import { mixinMuiTextInputBorder } from "@/styles/mixins";
import { Button, Modal, Stack, styled, TextField, Typography } from "@mui/material";
import React from "react";

const SettingRoundModal = () => {
  const { isSettingRoundModalOpen, setIsSettingRoundModalOpen } = useEditDormitoryModalStore.getState();
  const { round, setRound } = useDormitoryStore.getState();

  return (
    <Modal open={isSettingRoundModalOpen} onClose={() => setIsSettingRoundModalOpen(false)}>
      <ModalContainer>
        <Typography variant="h6" align="center">
          차수 설정
        </Typography>
        <StyleTextField type="number" label="차수" value={round} onChange={(e) => setRound(Number(e.target.value))} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setIsSettingRoundModalOpen(false);
          }}
        >
          저장
        </Button>
      </ModalContainer>
    </Modal>
  );
};

export default SettingRoundModal;

const ModalContainer = styled(Stack)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 100px;
  padding-top: 75px;
  row-gap: 16px;
  background-color: white;
  border-radius: 10px;
`;

const StyleTextField = styled(TextField)`
  ${({ theme }) => mixinMuiTextInputBorder(theme)}
`;
