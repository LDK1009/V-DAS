import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { TableRowType } from "@/types/card";

function getAssignedInfo(cardInfo: TableRowType | null) {
  const {maxRoomPeople} = useDormitoryStore.getState();

  if (!cardInfo) return "";

  const { startAssignedInfo, endAssignedInfo } = cardInfo.assignedInfo;
  const startAssignedCount = startAssignedInfo.assignedCount !== maxRoomPeople ? `(${startAssignedInfo.assignedCount})` : "";
  const endAssignedCount = endAssignedInfo.assignedCount !== maxRoomPeople ? `(${endAssignedInfo.assignedCount})` : "";

  if(startAssignedInfo.roomNumber === endAssignedInfo.roomNumber) {
    return `${startAssignedInfo.roomNumber}호${startAssignedCount}`;
  }
  
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
