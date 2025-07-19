import React from "react";
import { CardInfoType } from "@/types/card";
import { getAB, getAssignedInfo } from "@/utils/export/card";
import { styled } from "@mui/material";

const TableItem = ({ churchName, maleCardInfo, femaleCardInfo }: CardInfoType) => {
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
    <Table>
      <tbody>
        <ChurchNameRow>
          <ChurchName colSpan={4}>{churchName}</ChurchName>
        </ChurchNameRow>
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
  );
};

export default TableItem;

const Table = styled("table")`
  width: 100%;
  border: 1px solid black;
  border-left: none;
  border-collapse: collapse;
  font-size: 12px;

  & tr {
    max-height: 30px;
    min-height: 30px;
  }

  & td {
    text-align: center;
    border-bottom: 1px solid black;
  }
`;

const Tr = styled("tr")`
  width: 100%;
  height: 30px;
  max-height: 30px;
`;

const ChurchNameRow = styled("tr")`
  height: 34px;
  max-height: 34px;
  min-height: 34px;
`;

const ChurchName = styled("td")`
  text-align: start !important;
  padding-left: 8px !important;
  font-size: 14px;
`;

const Sex = styled("td")`
  width: 20%;
`;

const TotalCount = styled("td")`
  width: 20%;
  border: 1px solid black;
`;

const AB = styled("td")`
  width: 10%;
`;

const AssignedInfo = styled("td")`
  width: 50%;
  text-align: start !important;
`;
