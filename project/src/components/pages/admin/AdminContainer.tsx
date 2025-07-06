"use client";

import React from "react";
import InputSection from "./container/InputSection";
import EditDormitoryContainer from "./container/edit-dormitory/EditDormitoryContainer";
import { Grid2, Stack, styled } from "@mui/material";
import ChurchListContainer from "./container/church-list/ChurchListContainer";

const AdminContainer = () => {
  return (
    <div>
      <h1>AdminContainer</h1>
      <InputSection />
      <BodyArea container>
        <Grid2 size={4}>
          <ChurchListContainer />
        </Grid2>
        <Grid2 size={8}>
          <EditDormitoryContainer />
        </Grid2>
      </BodyArea>
    </div>
  );
};

export default AdminContainer;

const BodyArea = styled(Grid2)`
  padding: 32px;
`;
