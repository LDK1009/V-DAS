import { mixinFlex } from "@/styles/mixins";
import { Stack, styled, Typography } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <Container>
      <FooterText> © VISIONPOWER</FooterText>
      <FooterText>T.070-8668-5025</FooterText>
    </Container>
  );
};

export default Footer;

const Container = styled(Stack)`
  position: fixed;
  bottom: 0;
  left: 0;
  ${mixinFlex("row", "space-between", "center")}
  width: 100%;
  height: 35px;
  background-color: #797979;
  padding: 0px 12px;
`;

const FooterText = styled(Typography)`
  font-size: 10px;
  color: #ffffff;
`;
