import { mixinFlex, mixinMuiButtonNoShadow } from "@/styles/mixins";
import { AddCircleOutlineRounded } from "@mui/icons-material";
import { Button, Modal, Stack, styled, TextField } from "@mui/material";
import React, { useState } from "react";
import { useCurrentChurchStore } from "@/store/church/churchStore";
import { enqueueSnackbar } from "notistack";

const AddCurchButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [churchName, setChurchName] = useState("");
  const [churchCount, setChurchCount] = useState("");

  const { addChurch, currentChurchSex } = useCurrentChurchStore();

  function handleSave() {
    if (!churchName || !churchCount) {
      enqueueSnackbar("교회 이름과 인원을 입력해주세요.", { variant: "error" });
      return;
    }
    if (Number(churchCount) < 0) {
      enqueueSnackbar("교회 인원은 0이상의 정수를 입력해주세요.", { variant: "error" });
      return;
    }
    addChurch(currentChurchSex, churchName, Number(churchCount));
    setIsModalOpen(false);
    setChurchName("");
    setChurchCount("");
  }

  return (
    <>
      <ModalButton onClick={() => setIsModalOpen(true)}>
        <AddCircleOutlineRounded sx={{ fontSize: 16 }} />
      </ModalButton>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContainer>
          <ChurchNameField label="교회 이름" value={churchName} onChange={(e) => setChurchName(e.target.value)} />
          <ChurchCountField
            label="교회 인원"
            value={churchCount}
            onChange={(e) => setChurchCount(e.target.value)}
            type="number"
          />
          <SaveButton variant="contained" onClick={handleSave}>
            추가
          </SaveButton>
        </ModalContainer>
      </Modal>
    </>
  );
};

export default AddCurchButton;

const ModalButton = styled(Stack)`
  ${mixinFlex("row", "center", "center")}
  width: 164px;
  height: 20px;
  min-height: 20px;
  border: 1px solid #000000;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 1px;

  &:hover {
    background-color: black;
    color: white;
  }
`;

const ModalContainer = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  row-gap: 16px;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;

  background-color: white;
  border-radius: 16px;
  padding: 100px 50px;
`;

const ChurchNameField = styled(TextField)``;

const ChurchCountField = styled(TextField)``;

const SaveButton = styled(Button)`
  width: 100%;
  ${mixinMuiButtonNoShadow}
`;
