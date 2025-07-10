import { mixinEllipsis, mixinFlex } from "@/styles/mixins";
import { ChurchType } from "@/types/currentChurchType";
import { Stack, styled, Typography } from "@mui/material";
import React from "react";

const ChurchItem = ({ church }: { church: ChurchType }) => {
  return (
    <Container>
      <ChurchName>{church.churchName}</ChurchName>
      <ChurchPeople>{church.people}</ChurchPeople>
    </Container>
  );
};

export default ChurchItem;

const Container = styled(Stack)`
  width: 164px;
  ${mixinFlex("row", "start", "center")}
  border-radius: 12px;
  border: 1px solid #000000;
`;

const ChurchName = styled(Typography)`
  margin-left: 12px;
  font-size: 12px;
  height: 20px;
  flex: 1;
  ${mixinEllipsis()};
`;

const ChurchPeople = styled(Typography)`
  width: 40px;
  height: 20px;
  ${mixinFlex("column", "center", "center")}

  border-left: 1px solid #000000;
  font-size: 16px;
  text-align: center;
`;
