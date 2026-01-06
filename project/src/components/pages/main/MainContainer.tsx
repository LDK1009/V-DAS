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
      <NoticeImage src="/img/main-notice.png" alt="main-notice" />
      <InputSection />
      <Footer />
    </Container>
  );
};

export default MainContainer;

const Container = styled(Stack)`
  ${mixinFlex("column", "space-between", "center")};
  width: 100vw;
  height: 100vh;

  padding: 50px;
`;

const NoticeImage = styled("img")`
  width: 100%;
  max-width: 500px;
  height: auto;
`;
