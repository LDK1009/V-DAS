"use client";

import React from "react";
import InputSection from "./container/InputSection";
import EditDormitoryContainer from "./container/edit-dormitory/EditDormitoryContainer";

const AdminContainer = () => {
  return (
    <div>
      <h1>AdminContainer</h1>
      <InputSection />
      <EditDormitoryContainer />
    </div>
  );
};

export default AdminContainer;
