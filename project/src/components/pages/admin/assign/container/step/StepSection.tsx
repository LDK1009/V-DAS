import { Box, styled } from "@mui/material";
import React from "react";
import { mixinFlex } from "@/styles/mixins";
import StepGroup from "./StepGroup";

const StepSection = () => {
  return (
    <Container>
      <StepGroup />
    </Container>
  );
};

export default StepSection;

const Container = styled(Box)`
  ${mixinFlex("row", "center", "center")}
  row-gap: 12px;
  width: 100%;
  padding: 16px;
`;
