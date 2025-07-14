import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { mixinFlex, mixinMuiButtonNoShadow } from "@/styles/mixins";
import { Button, Stack, styled } from "@mui/material";
import React, { useEffect } from "react";
import { shouldForwardProp } from "@/utils/mui";
import { DormitoryType } from "@/types/dormitory";
import { getDormitory } from "@/utils/dormitory/make";
import { useFloorStore } from "@/store/dormitory/useFloorStore";

const SelectUseFloor = () => {
  ////////////////////////////////////////////////// 상태관리
  const { selectedSex, setSelectedSex, useFloorNumbers, handleSelectUseFloor } = useFloorStore();
  const { setUseFloor, setDormitoryData } = useDormitoryStore();

  ////////////////////////////////////////////////// 렌더링
  // 층 버튼 렌더링
  const renderFloorButton = [2, 3, 4, 5, 6, 7, 8, 9].map((number, index) => {
    const isInMale = useFloorNumbers.male.includes(number);
    const isInFemale = useFloorNumbers.female.includes(number);

    return (
      <FloorSelectButton
        key={index}
        onClick={() => handleSelectUseFloor(number)}
        $isInMale={isInMale}
        $isInFemale={isInFemale}
      >
        {number}
      </FloorSelectButton>
    );
  });

  ////////////////////////////////////////////////// 라이프사이클
  useEffect(() => {
    setUseFloor("male", useFloorNumbers.male);
    setUseFloor("female", useFloorNumbers.female);
  }, [useFloorNumbers, setUseFloor]);

  useEffect(() => {
    const initialDormitory: DormitoryType = {
      male: getDormitory({ sex: "male", useFloorNumbers: useFloorNumbers.male }),
      female: getDormitory({ sex: "female", useFloorNumbers: useFloorNumbers.female }),
    };

    setDormitoryData(initialDormitory);
  }, [useFloorNumbers, setUseFloor, setDormitoryData]);

  ////////////////////////////////////////////////// 렌더링
  return (
    <Container>
      <SelectSexButtonContainer>
        <SelectMaleButton
          $isSelected={selectedSex === "male"}
          variant={selectedSex === "male" ? "contained" : "outlined"}
          onClick={() => setSelectedSex("male")}
        >
          남자
        </SelectMaleButton>
        <SelectFemaleButton
          $isSelected={selectedSex === "female"}
          variant={selectedSex === "female" ? "contained" : "outlined"}
          onClick={() => setSelectedSex("female")}
        >
          여자
        </SelectFemaleButton>
      </SelectSexButtonContainer>
      <FloorSelectButtonContainer>{renderFloorButton}</FloorSelectButtonContainer>
    </Container>
  );
};

export default SelectUseFloor;

const Container = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  width: 100%;
  row-gap: 16px;
  padding: 32px 16px;
  border: 1px solid ${({ theme }) => theme.palette.primary.main};
  border-radius: 8px;
`;

const SelectSexButtonContainer = styled(Stack)`
  ${mixinFlex("row", "space-between", "center")}
  column-gap: 8px;
  width: 100%;
`;

type SelectSexButtonPropsType = {
  $isSelected: boolean;
};

const SelectSexButton = styled(Button)`
  flex: 1;
  ${mixinMuiButtonNoShadow}
`;

const SelectMaleButton = styled(SelectSexButton, { shouldForwardProp })<SelectSexButtonPropsType>`
  background-color: ${({ $isSelected }) => ($isSelected ? "#6495ED" : "white")};
  color: ${({ theme, $isSelected }) => ($isSelected ? theme.palette.text.white : theme.palette.primary.main)};
`;

const SelectFemaleButton = styled(SelectSexButton, { shouldForwardProp })<SelectSexButtonPropsType>`
  background-color: ${({ $isSelected }) => ($isSelected ? "#ff66b2" : "white")};
  color: ${({ theme, $isSelected }) => ($isSelected ? theme.palette.text.white : theme.palette.primary.main)};
`;

const FloorSelectButtonContainer = styled(Stack)`
  ${mixinFlex("row", "space-between", "center")}
  column-gap: 8px;
  width: 100%;
`;

type FloorSelectButtonPropsType = {
  $isInMale: boolean;
  $isInFemale: boolean;
};

const FloorSelectButton = styled(Button, { shouldForwardProp })<FloorSelectButtonPropsType>`
  width: 40px;
  height: 40px;
  max-width: 40px;
  max-height: 40px;
  min-width: 40px;
  min-height: 40px;
  background-color: ${({ $isInMale, $isInFemale }) => ($isInMale ? "#6495ED	" : $isInFemale ? "#ff66b2" : "white")};
  color: ${({ theme, $isInMale, $isInFemale }) => ($isInMale || $isInFemale ? "white" : theme.palette.primary.main)};
  border: 1px solid
    ${({ theme, $isInMale, $isInFemale }) => ($isInMale || $isInFemale ? "transparent" : theme.palette.primary.main)};
`;
