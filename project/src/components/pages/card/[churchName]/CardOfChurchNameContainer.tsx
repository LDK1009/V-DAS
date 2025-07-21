"use client";

import { mixinFlex } from "@/styles/mixins";
import { ChurchCardType } from "@/types/camp";
import { Stack, styled } from "@mui/material";
import React from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import AssignCard from "./container/AssignCard";

type PropsType = {
  churchCardInfo: ChurchCardType;
};

const CardOfChurchNameContainer = ({ churchCardInfo }: PropsType) => {
  return (
    <Container>
      <Header />
      <AssignCard {...churchCardInfo} />
      <Footer />
    </Container>
  );
};

export default CardOfChurchNameContainer;

const Container = styled(Stack)`
  ${mixinFlex("column", "start", "center")};
  width: 100vw;
  height: 100vh;

  padding: 126px 50px 0px 50px;
`;
