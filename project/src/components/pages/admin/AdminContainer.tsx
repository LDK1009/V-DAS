"use client";

import React from "react";
import EditDormitoryContainer from "./container/edit-dormitory/EditDormitoryContainer";
import { Stack, styled } from "@mui/material";
import ChurchListContainer from "./container/church-list/ChurchListContainer";
import Header from "./container/etc/Header";
import { mixinFlex } from "@/styles/mixins";
import ChurchListHeader from "./container/church-list/ChurchListHeader";
import StepSection from "./container/step/StepSection";
import ExportCard from "./container/export/card/ExportCard";
import ExportTable from "./container/export/table/ExportTable";

const AdminContainer = () => {
  return (
    <>
      <Container>
        <Header />
        <StepSection />
        <BodyArea>
          <BodyLeft>
            <ChurchListHeader />
            <ChurchListContainer />
          </BodyLeft>
          <BodyRight>
            <EditDormitoryContainer />
          </BodyRight>
        </BodyArea>
        <ExportCard />
        <ExportTable />
      </Container>
    </>
  );
};

export default AdminContainer;

const Container = styled(Stack)`
  position: relative;
  width: 100vw;
  height: 100vh;
  ${mixinFlex("column", "start", "start")}
  overflow: hidden;
`;

const BodyArea = styled(Stack)`
  ${mixinFlex("row", "start", "start")}
  width: 100%;
  height: 100%;
  border-top: 1px solid black;
`;

const BodyLeft = styled(Stack)`
  width: 256px;
  height: 100%;
  min-width: 256px;
  max-width: 256px;
  flex: 1;
  border-right: 1px solid black;
`;

const BodyRight = styled(Stack)`
  width: 100%;
  height: 100%;
`;
