import { mixinFlex } from "@/styles/mixins";
import { Stack, styled } from "@mui/material";
import React from "react";

const Header = () => {
  return <Container>VISIONCAMP 숙소배정</Container>;
};

export default Header;

const Container = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  width: 100%;
  height: 58px;
  border: 1px solid black;
  font-size: 25px;
  margin-bottom: 100px;
`;
