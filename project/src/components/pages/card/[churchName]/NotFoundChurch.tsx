"use client";

import { Stack, styled, Typography } from "@mui/material";
import React from "react";
import Footer from "./container/Footer";
import { mixinFlex } from "@/styles/mixins";
import { SearchOffRounded } from "@mui/icons-material";

const NotFoundChurch = () => {
  return (
    <Container>
      <Typography variant="h3" mb={2}>
        <SearchOffRounded sx={{ fontSize: 80 }} color="disabled" />
      </Typography>
      <Typography variant="h5" color="text.secondary">
        존재하지 않는 교회명입니다.
      </Typography>
      <Footer />
    </Container>
  );
};

export default NotFoundChurch;

const Container = styled(Stack)`
  ${mixinFlex("column", "center", "center")};
  width: 100vw;
  height: 100vh;

  padding: 0px 50px 0px 50px;
`;
