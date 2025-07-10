import { Stack, styled } from "@mui/material";
import React from "react";
import AutoControlButtonGroup from "./AutoControlButtonGroup";
import { mixinFlex } from "@/styles/mixins";
import InputSection from "./InputSection";
import EditFloorCount from "../edit-dormitory/EditFloorCount";

const ButtonSection = () => {
  return (
    <Container>
      <InputSection />
      <EditFloorCount />
      <AutoControlButtonGroup />
    </Container>
  );
};

export default ButtonSection;

const Container = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  row-gap: 12px;
  width: 100%;
  height: 140px;
  background-color: #ffff00;
`;
