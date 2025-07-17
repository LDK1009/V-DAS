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
  return (
    <>
      <div>{churchName}</div>
      <div style={{ display: "flex" }}>
        <div>{maleCardInfo?.sex === "male" ? "남자" : "여자"}</div>
        <div>{maleCardInfo?.assignedInfo.totalAssignedCount}명</div>
        <div>{maleCardInfo?.assignedInfo.floorNumber}층</div>
        <span>{`${maleCardInfo?.assignedInfo.startAssignedInfo.roomNumber}호`}</span>
        {maleCardInfo?.assignedInfo.startAssignedInfo.assignedCount !== 7 && (
          <span>{`(${maleCardInfo?.assignedInfo.startAssignedInfo.assignedCount})`}</span>
        )}
        <span>{`${maleCardInfo?.assignedInfo.endAssignedInfo.roomNumber}호`}</span>
        {maleCardInfo?.assignedInfo.endAssignedInfo.assignedCount !== 7 && (
          <span>{`(${maleCardInfo?.assignedInfo.endAssignedInfo.assignedCount})`}</span>
        )}
      </div>
      <div style={{ display: "flex" }}>
        <div>{femaleCardInfo?.sex === "female" ? "여자" : "남자"}</div>
        <div>{femaleCardInfo?.assignedInfo.totalAssignedCount}명</div>
        <div>{femaleCardInfo?.assignedInfo.floorNumber}층</div>
        <span>{`${femaleCardInfo?.assignedInfo.startAssignedInfo.roomNumber}호`}</span>
        {femaleCardInfo?.assignedInfo.startAssignedInfo.assignedCount !== 7 && (
          <span>{`(${femaleCardInfo?.assignedInfo.startAssignedInfo.assignedCount})`}</span>
        )}
        <span>{`${femaleCardInfo?.assignedInfo.endAssignedInfo.roomNumber}호`}</span>
        {femaleCardInfo?.assignedInfo.endAssignedInfo.assignedCount !== 7 && (
          <span>{`(${femaleCardInfo?.assignedInfo.endAssignedInfo.assignedCount})`}</span>
        )}
      </div>
    </>
  );
};

export default AssignCard;
