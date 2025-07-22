"use client";
import { Stack, styled } from "@mui/material";
import React from "react";
import Header from "../_container/Header";
import { mixinFlex } from "@/styles/mixins";
import ManageArea from "./container/ManageArea";

const ManageContainer = () => {
  return (
    <Container>
      <Header />
      <ContentContainer>
        <ManageArea />
      </ContentContainer>
    </Container>
  );
};

export default ManageContainer;

const Container = styled(Stack)`
  width: 100vw;
  height: 100vh;
`;

const ContentContainer = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  width: 100%;
  height: 100%;
  padding:200px;
`;