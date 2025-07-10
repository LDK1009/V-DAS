"use client";

import React from "react";
import EditDormitoryContainer from "./container/edit-dormitory/EditDormitoryContainer";
import { Stack, styled } from "@mui/material";
import ChurchListContainer from "./container/church-list/ChurchListContainer";
import ButtonSection from "./container/button/ButtonSection";
import Header from "./container/etc/Header";
import { mixinFlex } from "@/styles/mixins";
import ChurchListHeader from "./container/church-list/ChurchListHeader";

const AdminContainer = () => {
  return (
    <div>
      <Header />
      <ButtonSection />
      <BodyArea>
        <BodyLeft>
          <ChurchListHeader />
          <ChurchListContainer />
        </BodyLeft>
        <BodyRight>
          <EditDormitoryContainer />
        </BodyRight>
      </BodyArea>
    </div>
  );
};

export default AdminContainer;

const BodyArea = styled(Stack)`
  ${mixinFlex("row", "start", "start")}
  width: 100%;
  height: 100%;
`;

const BodyLeft = styled(Stack)`
  min-width: 256px;
  width: 256px;
  height: 100%;
`;

const BodyRight = styled(Stack)`
  width: 100%;
  height: 100%;
`;
