import { mixinFlex } from "@/styles/mixins";
import { getAB, getAssignedInfo } from "@/utils/export/card";
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
    <Container className="assign-card">
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
        <AlertText align="left">
          * 괄호 안의 숫자는 해당 호실에 배정된 인원이며,
          <br />
          &nbsp;&nbsp;해당 호실은 다른 교회와 함께 사용하게 됩니다 :)
        </AlertText>
      </ContentContainer>
      <TextLogoContainer>
        <TextLogo variant="h5">VISIONCAMP</TextLogo>
      </TextLogoContainer>
    </Container>
  );
};

export default AssignCard;

const Container = styled(Stack)`
  ${mixinFlex("column", "center", "center")};
  width: 375px;
  height: 300px;
  padding: 24px;
  padding-bottom: 0px;
  background-color: #efa235;
`;

const ContentContainer = styled(Stack)`
  ${mixinFlex("column", "center", "center")};
  row-gap: 16px;
  width: 100%;
  height: 100%;
  padding: 24px;
  background-color: white;
  box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.25);
`;

const Table = styled("table")`
  border-collapse: collapse;
  width: 100%;
  border-top: 1px solid black;

  & td {
    padding: 12px 0px;
    font-size: 14px;
    line-height: 1.5;
    text-align: center;
    border-bottom: 1px solid black;
  }
`;

const Tr = styled("tr")``;

const Sex = styled("td")`
  width: 20%;
`;

const TotalCount = styled("td")`
  width: 20%;
  border-left: 1px solid black;
  border-right: 1px solid black;
`;

const AB = styled("td")`
  width: 10%;
`;

const AssignedInfo = styled("td")`
  text-align: start !important;
  width: 60%;
`;

const ChurchName = styled(Typography)``;

const AlertText = styled(Typography)`
  font-size: 7px;
`;
const TextLogoContainer = styled(Stack)`
  ${mixinFlex("column", "center", "center")};
  width: 100%;
  height: 64px;
`;

const TextLogo = styled(Typography)`
  font-weight: bolder;
  color: #3956bc;
`;
