import { mixinFlex } from "@/styles/mixins";
import { Stack, styled, Typography } from "@mui/material";
import React from "react";

const Header = () => {
  return (
    <Container>
      <Text>VISIONCAMP 숙소배정기</Text>
    </Container>
  );
};

export default Header;

const Container = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  width: 100%;
  height: 40px;
  background-color: #ffc300;
  color: ${({ theme }) => theme.palette.text.black};
`;

const Text = styled(Typography)`
  font-size: 16px;
  font-weight: 700;
`;
