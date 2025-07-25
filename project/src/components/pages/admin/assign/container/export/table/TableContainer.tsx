import { mixinFlex } from "@/styles/mixins";
import { Grid2, Stack, styled, Typography } from "@mui/material";
import React from "react";
import TableItem from "./TableItem";
import { CardInfoType } from "@/types/card";

const TableContainer = ({ churchCardDatas }: { churchCardDatas: CardInfoType[] }) => {
  return (
    <Container className="assign-table">
      <Title variant="h5" align="center">
        숙소배정표
      </Title>
      <ItemContainer container spacing={1}>
        {churchCardDatas.map((churchCardData, index) => (
          <ItemGrid size={6} key={index}>
            <TableItem {...churchCardData} />
          </ItemGrid>
        ))}
      </ItemContainer>
      <Footer>괄호 안의 숫자는 해당 호실에 배정된 인원이며, 해당 호실은 다른 교회와 함께 사용하게 됩니다 :)</Footer>
    </Container>
  );
};

export default TableContainer;

const Container = styled(Stack)`
  ${mixinFlex("column", "start", "start")};
  width: 595px;
  min-width: 595px;
  max-width: 595px;
  height: 842px;
  min-height: 842px;
  max-height: 842px;
  background-color: white;
  border: 1px solid black;

  margin-left: 8px !important;
`;

const Title = styled(Typography)`
  width: 100%;
  font-size: 35px;
  /* line-height: 88px; */
  line-height: 80px;
  text-align: center;
`;

const ItemContainer = styled(Grid2)`
  width: 100%;
  height: 695px;
  min-height: 695px;
  max-height: 695px;
  padding: 0px 40px;
`;

const ItemGrid = styled(Grid2)``;

const Footer = styled(Typography)`
  width: 100%;
  line-height: 59px;
  font-size: 12px;
  text-align: center;
  margin-top: 12px;
`;
