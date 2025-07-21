"use client";

import { styled, Stack } from "@mui/material";
import { mixinFlex } from "@/styles/mixins";
import Header from "./container/Header";
import InputSection from "./container/InputSection";
import Footer from "./container/Footer";

const MainContainer = () => {
  return (
    <Container>
      <Header />
      <InputSection />
      <Footer />
    </Container>
  );
};

export default MainContainer;

const Container = styled(Stack)`
  ${mixinFlex("column", "start", "center")};
  width: 100vw;
  height: 100vh;

  padding: 126px 50px 0px 50px;
`;
