import { useCardFormat } from "@/hooks/export/card/useCardFormat";
import React from "react";
import TableContainer from "./TableContainer";
import { mixinFlex } from "@/styles/mixins";
import { Stack, styled } from "@mui/material";
import { chunkArray } from "@/utils/export/table";

const ExportTable = () => {
  const { getAllChurchCardData } = useCardFormat();

  const churchCardDatas = getAllChurchCardData();

  // 14개씩 나눈 데이터 배열
  const chunkedDatas = chunkArray(churchCardDatas, 14);

  return (
    <Container>
      {chunkedDatas.map((chunkedData, index) => (
        <TableContainer key={index} churchCardDatas={chunkedData} />
      ))}
    </Container>
  );
};

export default ExportTable;

const Container = styled(Stack)`
  position: absolute;
  ${mixinFlex("column", "start", "start")};
  top: 0px;
  left: 100%;
  /* top: 0%; */
  /* right: 0px; */
`;
