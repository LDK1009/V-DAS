import { mixinFlex } from "@/styles/mixins";
import { Stack, styled } from "@mui/material";
import React from "react";

const Header = () => {
  return (
    <Container>
      <h3>헤더?</h3>
    </Container>
  );
};

export default Header;

const Container = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  width: 100%;
  height: 40px;
  background-color: #000000;
  color: ${({ theme }) => theme.palette.text.white};
`;
