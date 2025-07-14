import { Stack, styled } from "@mui/material";
import React from "react";
import Line from "./Line";

const LineColumn = ({ lineIndexs }: { lineIndexs: number[] }) => {
  return (
    <Container>
      {lineIndexs.map((lineIndex) => {
        return <Line lineIndex={lineIndex} key={lineIndex} />;
      })}
    </Container>
  );
};

export default LineColumn;

const Container = styled(Stack)`
  padding: 12px 8px;
  row-gap: 44px;
`;
