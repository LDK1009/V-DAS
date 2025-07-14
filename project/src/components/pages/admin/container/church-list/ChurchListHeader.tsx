import { mixinFlex } from "@/styles/mixins";
import { Stack, styled } from "@mui/material";
import React from "react";

const ChurchListHeader = () => {
  return (
    <Container>
      <h4>검색바 들어올 예정</h4>
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
