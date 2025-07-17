import React from "react";
import { shouldForwardProp } from "@/utils/mui";
import { useCurrentChurchStore } from "@/store/church/churchStore";
import { Button, Stack, styled } from "@mui/material";
import { mixinFlex } from "@/styles/mixins";

const SelectSexButtonGroup = () => {
  const { currentChurchSex, setCurrentChurchSex } = useCurrentChurchStore();

  return (
    <Container>
      <SelectMaleButton $isSelected={currentChurchSex === "male"} onClick={() => setCurrentChurchSex("male")}>
        남자
      </SelectMaleButton>
      <SelectFemaleButton $isSelected={currentChurchSex === "female"} onClick={() => setCurrentChurchSex("female")}>
        여자
      </SelectFemaleButton>
    </Container>
  );
};

export default SelectSexButtonGroup;

const Container = styled(Stack)`
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  ${mixinFlex("row", "center", "center")}
  column-gap: 8px;
  width: 100%;
`;
type SelectButtonPropsType = {
  $isSelected: boolean;
};

const SelectMaleButton = styled(Button, { shouldForwardProp })<SelectButtonPropsType>`
  background-color: ${({ $isSelected }) => ($isSelected ? "#6495ED" : "white")};
  color: ${({ theme, $isSelected }) => ($isSelected ? theme.palette.text.white : "#6495ED")};
  border: 1px solid #6495ed;
`;

const SelectFemaleButton = styled(Button, { shouldForwardProp })<SelectButtonPropsType>`
  background-color: ${({ $isSelected }) => ($isSelected ? "#ff66b2" : "white")};
  color: ${({ theme, $isSelected }) => ($isSelected ? theme.palette.text.white : "#ff66b2")};
  border: 1px solid #ff66b2;
`;
