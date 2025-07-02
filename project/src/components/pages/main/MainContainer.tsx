"use client";

import { mixinContainer, mixinFlex } from "@/styles/mixins";
import { styled, Box } from "@mui/material";

//////////////////////////////////////// Component ////////////////////////////////////////

/**
 * 메인 페이지 컨테이너 컴포넌트
 * 프로젝트 소개 및 README 내용을 표시
 */
const MainContainer = () => {
  //////////////////////////////////////// Render ////////////////////////////////////////

  return <Container>Hello World</Container>;
};

export default MainContainer;

//////////////////////////////////////// Styles ////////////////////////////////////////

// 메인 컨테이너 스타일
const Container = styled(Box)`
  ${mixinContainer()};
  ${mixinFlex("column")};
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
`;
