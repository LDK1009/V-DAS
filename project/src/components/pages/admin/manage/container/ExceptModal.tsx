import { useExceptModalStore } from "@/store/ui/exceptModalStore";
import { Button, MenuItem, Modal, Select, Stack, styled, Typography } from "@mui/material";
import React, { useEffect } from "react";
import ExceptInputGroup from "./ExceptInputGroup";
import { AddCircleOutlineRounded } from "@mui/icons-material";
import { mixinHideScrollbar, mixinMuiButtonNoShadow } from "@/styles/mixins";
import { postExceptions } from "@/service/table/exceptions/exceptions";
import { enqueueSnackbar } from "notistack";

const ExceptModal = () => {
  const { isExceptModalOpen, setIsExceptModalOpen, exceptions, addNewException, exceptionRound } = useExceptModalStore();

  async function handleSave() {
    const response = await postExceptions(exceptionRound || 0, exceptions);
    if (typeof response === "string") {
      enqueueSnackbar(response, { variant: "error" });
      return;
    }

    enqueueSnackbar("저장되었습니다.", { variant: "success" });
    setIsExceptModalOpen(false);
  }

  return (
    <Modal open={isExceptModalOpen} onClose={() => setIsExceptModalOpen(false)}>
      <ModalContainer>
        <Typography variant="h6" fontWeight={700} align="center">
          수동 배정 현황 변경
        </Typography>
        {/* <pre>{JSON.stringify(exceptions, null, 2)}</pre> */}
        <RoundSelector />
        <ExceptionContainer>
          {exceptions.map((exception, index) => (
            <ExceptInputGroup key={index} exception={exception} index={index} />
          ))}
          <Button variant="outlined" onClick={addNewException}>
            <AddCircleOutlineRounded />
          </Button>
        </ExceptionContainer>

        <SaveButton variant="contained" onClick={handleSave}>
          저장하기
        </SaveButton>
      </ModalContainer>
    </Modal>
  );
};

export default ExceptModal;

const ModalContainer = styled(Stack)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  padding: 32px;
  row-gap: 40px;
  background-color: white;
  border-radius: 10px;
`;

const SaveButton = styled(Button)`
  ${mixinMuiButtonNoShadow}
`;

const ExceptionContainer = styled(Stack)`
  row-gap: 16px;
  padding-top: 16px;
  max-height: 300px;
  overflow-y: auto;
  ${mixinHideScrollbar}
`;

const RoundSelector = () => {
  const { exceptionRound, setExceptionRound, getRounds, rounds } = useExceptModalStore();

  useEffect(() => {
    getRounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RoundSelectorContainer>
      <Typography variant="body1" fontWeight={700} align="left">
        회차
      </Typography>
      <Select
        value={exceptionRound || ""}
        onChange={(e) => setExceptionRound(e.target.value as number)}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: "#f5f5f5", // 원하는 배경색으로 변경
              "& .MuiMenuItem-root": {
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
                "&.Mui-selected": {
                  backgroundColor: "#FFC300",
                  "&:hover": {
                    backgroundColor: "#FFA600",
                  },
                },
              },
            },
          },
        }}
      >
        {rounds?.map((round) => (
          <MenuItem key={round} value={round}>
            {round}차
          </MenuItem>
        ))}
      </Select>
    </RoundSelectorContainer>
  );
};

const RoundSelectorContainer = styled(Stack)`
  row-gap: 4px;
`;
