import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { mixinFlex, mixinMuiButtonNoShadow } from "@/styles/mixins";
import { Button, Stack, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { shouldForwardProp } from "@/utils/mui";
import { DormitoryType } from "@/types/dormitory";
import { getDormitory } from "@/utils/dormitory/make";
import { enqueueSnackbar } from "notistack";

const SelectUseFloor = () => {
  ////////////////////////////////////////////////// 상태관리
  const [selectedSex, setSelectedSex] = useState<"male" | "female">("male");
  const [useFloorNumbers, setUseFloorNumbers] = useState<{ male: number[]; female: number[] }>({
    male: [2, 3, 4, 5],
    female: [6, 7, 8, 9],
  });
  const { setUseFloor, setDormitoryData } = useDormitoryStore();

  ////////////////////////////////////////////////// 함수
  // 층 버튼 선택
  function handleSelectUseFloor(floorNumber: number) {
    if (selectedSex === "male") {
      addFloor("male", floorNumber);
    }
    if (selectedSex === "female") {
      addFloor("female", floorNumber);
    }
  }

  // 층 버튼 추가
  function addFloor(sex: "male" | "female", floorNumber: number) {
    const allUseFloor = [...useFloorNumbers.male, ...useFloorNumbers.female];

    // 이미 추가된 층인 경우
    if (allUseFloor.includes(floorNumber)) {
      const newMaleUseFloor = useFloorNumbers.male.filter((number) => {
        return number !== floorNumber;
      });

      const newFemaleUseFloor = useFloorNumbers.female.filter((number) => {
        return number !== floorNumber;
      });

      if (newMaleUseFloor.length === 0 || newFemaleUseFloor.length === 0) {
        enqueueSnackbar("최소 1개의 층을 선택해주세요.", { variant: "error" });
        return;
      }

      setUseFloorNumbers((prev) => ({ ...prev, male: newMaleUseFloor, female: newFemaleUseFloor }));

      return;
    }

    // 추가되지 않은 층인 경우
    const newUseFloorNumbers = [...useFloorNumbers[sex], floorNumber];
    setUseFloorNumbers((prev) => ({ ...prev, [sex]: newUseFloorNumbers }));
  }

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
        <SelectSexButton
          variant={selectedSex === "male" ? "contained" : "outlined"}
          onClick={() => setSelectedSex("male")}
        >
          남자
        </SelectSexButton>
        <SelectSexButton
          variant={selectedSex === "female" ? "contained" : "outlined"}
          onClick={() => setSelectedSex("female")}
        >
          여자
        </SelectSexButton>
      </SelectSexButtonContainer>
      <FloorSelectButtonContainer>{renderFloorButton}</FloorSelectButtonContainer>
    </Container>
  );
};

export default SelectUseFloor;

const Container = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
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

const SelectSexButton = styled(Button)`
  flex: 1;
  ${mixinMuiButtonNoShadow}
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
  background-color: ${({ $isInMale, $isInFemale }) => ($isInMale ? "blue" : $isInFemale ? "red" : "white")};
  color: ${({ theme, $isInMale, $isInFemale }) => ($isInMale || $isInFemale ? "white" : theme.palette.primary.main)};
  border: 1px solid
    ${({ theme, $isInMale, $isInFemale }) => ($isInMale || $isInFemale ? "transparent" : theme.palette.primary.main)};
`;
