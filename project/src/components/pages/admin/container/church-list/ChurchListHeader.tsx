import { mixinFlex } from "@/styles/mixins";
import { Stack, styled } from "@mui/material";
import React from "react";
import ChangeFloorButtonGroup from "../etc/ChangeFloorButtonGroup";

const ChurchListHeader = () => {
  return (
    <Container>
      <h4>검색바 들어올 예정</h4>
      <ChangeFloorButtonGroup />
    </Container>
  );
};

export default ChurchListHeader;

const Container = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  width: 100%;
  height: 85px;
  border-bottom: 1px solid black;
`;
