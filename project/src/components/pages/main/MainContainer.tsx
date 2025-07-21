"use client";

import { mixinContainer, mixinFlex } from "@/styles/mixins";
import { styled, Box } from "@mui/material";

const MainContainer = () => {
  return <Container>Hello World</Container>;
};

export default MainContainer;

// 메인 컨테이너 스타일
const Container = styled(Box)`
  ${mixinContainer()};
  ${mixinFlex("column")};
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
`;
