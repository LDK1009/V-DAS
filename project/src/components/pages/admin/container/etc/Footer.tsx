import { mixinFlex, mixinMuiButtonNoShadow } from "@/styles/mixins";
import { Button, Stack, styled } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <Container>
      <StyledButton variant="contained">저장하기</StyledButton>
      <StyledButton variant="contained">다운로드</StyledButton>
    </Container>
  );
};

export default Footer;

const Container = styled(Stack)`
  ${mixinFlex("row", "end", "center")}
  width: 100%;
  height: 53px;
  padding: 12px 16px;
  column-gap: 16px;
  border-top: 1px solid black;
`;

const StyledButton = styled(Button)`
  ${mixinMuiButtonNoShadow}
  width: 90px;
  height: 18px;
  border-radius: 12px;
`;