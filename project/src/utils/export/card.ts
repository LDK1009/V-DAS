import { TableRowType } from "@/types/card";

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

export { getAssignedInfo, getAB };
