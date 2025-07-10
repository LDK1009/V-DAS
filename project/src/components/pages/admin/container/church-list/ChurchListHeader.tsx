import { mixinFlex } from "@/styles/mixins";
import { Stack, styled } from "@mui/material";
import React from "react";
import ChangeFloorButtonGroup from "../edit-dormitory/ChangeFloorButtonGroup";

const ChurchListHeader = () => {
  return (
    <Container>
      <ChangeFloorButtonGroup />
    </Container>
  );
};

export default ChurchListHeader;

const Container = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  width: 100%;
  height: 60px;
  background-color: #000000;
`;
