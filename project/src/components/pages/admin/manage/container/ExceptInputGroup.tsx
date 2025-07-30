import React, { useCallback } from "react";
import { Button, Stack, styled, TextField } from "@mui/material";
import { mixinFlex, mixinMuiCircleShapeButton } from "@/styles/mixins";
import { useExceptModalStore } from "@/store/ui/exceptModalStore";
import { ExceptionTableType } from "@/types/exceptions";

const ExceptInputGroup = ({ index, exception }: { index: number; exception: ExceptionTableType }) => {
  const { updateException, updateNewAssigned } = useExceptModalStore();

  // 교회명 변경
  const handleChurchNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateException(index, "church_name", e.target.value);
    },
    [updateException, index]
  );

  // 성별 변경
  const handleSexToggle = useCallback(() => {
    updateException(index, "sex", exception.sex === "male" ? "female" : "male");
  }, [updateException, index, exception.sex]);

  // 총 배정 인원 변경
  const handleTotalAssignedCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNewAssigned(index, "totalAssignedCount", Number(e.target.value));
    },
    [updateNewAssigned, index]
  );

  // A/B 변경
  const handleAorBToggle = useCallback(() => {
    updateNewAssigned(index, "AorB", exception.new_assigned.AorB === "A" ? "B" : "A");
  }, [updateNewAssigned, index, exception.new_assigned.AorB]);

  // 배정 텍스트 변경
  const handleAssignedTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNewAssigned(index, "assignedText", e.target.value);
    },
    [updateNewAssigned, index]
  );

  return (
    <InputConatiner>
      <ChurchNameInput label="교회명" value={exception.church_name || ""} onChange={handleChurchNameChange} />
      <SexSelectButton sex={exception.sex} onClick={handleSexToggle}>
        {exception.sex === "male" ? "형제" : "자매"}
      </SexSelectButton>
      <TotalAssignedCountInput
        label="총 배정 인원"
        value={exception.new_assigned.totalAssignedCount || ""}
        onChange={handleTotalAssignedCountChange}
      />
      <AorBButton variant="contained" onClick={handleAorBToggle}>
        {exception.new_assigned.AorB}
      </AorBButton>
      <AssignedTextInput
        label="배정 텍스트"
        value={exception.new_assigned.assignedText || ""}
        onChange={handleAssignedTextChange}
      />
    </InputConatiner>
  );
};

export default ExceptInputGroup;

const InputConatiner = styled(Stack)`
  ${mixinFlex("row", "center", "center")}
  column-gap: 16px;
`;

type SexSelectButtonProps = {
  sex: "male" | "female";
};

const SexSelectButton = styled(Button)<SexSelectButtonProps>`
  background-color: ${({ sex }) => (sex === "male" ? "#6495ED" : "#ff66b2")};
  color: ${({ theme }) => theme.palette.text.white};
  ${mixinMuiCircleShapeButton(40)}
`;

const AorBButton = styled(Button)`
  ${mixinMuiCircleShapeButton(40)}
`;

const ChurchNameInput = styled(TextField)`
  flex: 1;
`;

const TotalAssignedCountInput = styled(TextField)`
  flex: 1;
`;

const AssignedTextInput = styled(TextField)`
  flex: 3;
`;
