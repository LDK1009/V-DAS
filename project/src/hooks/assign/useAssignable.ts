import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { ChurchType } from "@/types/currentChurchType";
import { DormitoryType, FloorType, LineType } from "@/types/dormitory";

type CheckLineAssignParamsType = {
  church: ChurchType;
  line: LineType;
};

function checkLineAssign({ church, line }: CheckLineAssignParamsType): { isAssignable: boolean; lineRemain: number } {
  let lineRemain = 0;

  line.rooms.forEach((room) => {
    lineRemain += room.remain;
  });

  if (lineRemain < church.people) {
    return { isAssignable: false, lineRemain: lineRemain };
  }

  return { isAssignable: true, lineRemain: 0 };
}

type GetAssignableInFloorParamsType = {
  church: ChurchType;
  floorIndex: number;
};

type LineInfoType = {
  lineIndex: number;
  lineRemain: number;
};

function getAssignableInFloor({ church, floorIndex }: GetAssignableInFloorParamsType) {
  const currentDormitory = useDormitoryStore.getState().dormitoryData;
  const { lines } = currentDormitory?.floors[floorIndex] as FloorType;

  const assignableLineInfoArray: LineInfoType[] = [];

  lines.forEach((line, lineIndex) => {
    const { isAssignable, lineRemain } = checkLineAssign({ church, line });

    if (isAssignable) {
      assignableLineInfoArray.push({ lineIndex: lineIndex, lineRemain: lineRemain });
    }
  });

  return assignableLineInfoArray;
}

type GetAssignableInDormitoryParamsType = {
  church: ChurchType;
};

function getAssignableInDormitory({ church }: GetAssignableInDormitoryParamsType) {
  // 실시간 최신 상태 가져오기
  const currentDormitory = useDormitoryStore.getState().dormitoryData;

  const { floors } = currentDormitory as DormitoryType;
  const assignableFloorIndexArray: { floorIndex: number; lineInfoArray: LineInfoType[] }[] = [];

  floors.forEach((_, floorIndex) => {
    const assignableLineIndexArray = getAssignableInFloor({ church, floorIndex });

    if (assignableLineIndexArray.length > 0) {
      assignableFloorIndexArray.push({ floorIndex: floorIndex, lineInfoArray: assignableLineIndexArray });
    }
  });

  return assignableFloorIndexArray;
}

export { checkLineAssign, getAssignableInFloor, getAssignableInDormitory };
