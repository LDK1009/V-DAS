import { mixinFlex } from "@/styles/mixins";
import { Stack, styled, Typography } from "@mui/material";
import React from "react";

type TableRowType = {
  sex: "male" | "female";
  assignedInfo: {
    totalAssignedCount: number;
    floorNumber: number;
    startAssignedInfo: {
      roomNumber: number;
      assignedCount: number;
    };
    endAssignedInfo: {
      roomNumber: number;
      assignedCount: number;
    };
  };
} | null;

type CardInfoType = {
  churchName: string;
  maleCardInfo: TableRowType | null;
  femaleCardInfo: TableRowType | null;
};

const AssignCard = ({ churchName, maleCardInfo, femaleCardInfo }: CardInfoType) => {
  function getAssignedInfo(cardInfo: TableRowType | null) {
    if (!cardInfo) return "";

    const { startAssignedInfo, endAssignedInfo } = cardInfo.assignedInfo;
    const startAssignedCount = startAssignedInfo.assignedCount !== 7 ? `(${startAssignedInfo.assignedCount})` : "";
    const endAssignedCount = endAssignedInfo.assignedCount !== 7 ? `(${endAssignedInfo.assignedCount})` : "";

    return `${startAssignedInfo.roomNumber}${startAssignedCount}-${endAssignedInfo.roomNumber}호${endAssignedCount}`;
  }

  function getAB(floorNumber: number) {
    if (!floorNumber) {
      return "";
    }
    if ([2, 3, 4, 5].includes(floorNumber)) {
      return "A";
    } else {
      return "B";
    }
  }

  const maleRow = {
    sex: "형제",
    totalCount: maleCardInfo?.assignedInfo.totalAssignedCount
      ? `${maleCardInfo?.assignedInfo.totalAssignedCount}명`
      : "",
    AB: getAB(maleCardInfo?.assignedInfo.floorNumber as number),
    assignedInfo: getAssignedInfo(maleCardInfo),
  };

  const femaleRow = {
    sex: "자매",
    totalCount: femaleCardInfo?.assignedInfo.totalAssignedCount
      ? `${femaleCardInfo?.assignedInfo.totalAssignedCount}명`
      : "",
    AB: getAB(femaleCardInfo?.assignedInfo.floorNumber as number),
    assignedInfo: getAssignedInfo(femaleCardInfo),
  };

  return (
    <Container>
      <ContentContainer>
        <ChurchName variant="h5">{churchName}</ChurchName>
        <Table>
          <tbody>
            <Tr>
              <Sex>{maleRow.sex}</Sex>
              <TotalCount>{maleRow.totalCount}</TotalCount>
              <AB>{maleRow.AB}</AB>
              <AssignedInfo>{maleRow.assignedInfo}</AssignedInfo>
            </Tr>
            <Tr>
              <Sex>{femaleRow.sex}</Sex>
              <TotalCount>{femaleRow.totalCount}</TotalCount>
              <AB>{femaleRow.AB}</AB>
              <AssignedInfo>{femaleRow.assignedInfo}</AssignedInfo>
            </Tr>
          </tbody>
        </Table>
      </ContentContainer>
      <TextLogo variant="h5">VISIONCAMP</TextLogo>
    </Container>
  );
};

export default AssignCard;

const Container = styled(Stack)`
  ${mixinFlex("column", "center", "center")};
  width: 500px;
  height: 400px;
  padding: 50px 25px;
  padding-bottom: 16px;
  background-color: #efa235;
`;

const ContentContainer = styled(Stack)`
  ${mixinFlex("column", "center", "center")};
  row-gap: 24px;
  width: 100%;
  height: 100%;
  padding: 40px;
  background-color: white;
  box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.25);
`;

const Table = styled("table")`
  border: 3px solid black;
  border-left: none;
  border-right: none;
  border-collapse: collapse;
  width: 100%;

  & td {
    padding: 16px 0px;
    font-size: 20px;
    line-height: 1.5;
    text-align: center;
    border-bottom: 3px solid black;
  }
`;

const Tr = styled("tr")``;

const Sex = styled("td")`
  width: 20%;
`;

const TotalCount = styled("td")`
  width: 20%;
  border: 3px solid black;
`;

const AB = styled("td")`
  width: 10%;
`;

const AssignedInfo = styled("td")`
  text-align: start !important;
  width: 60%;
`;

const ChurchName = styled(Typography)``;

const TextLogo = styled(Typography)`
  font-weight: bolder;
  color: #3956bc;
  margin-top: 16px;
`;
