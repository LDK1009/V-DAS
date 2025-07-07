import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { ChurchType } from "@/types/currentChurchType";
import { DormitoryType, FloorType, LineType } from "@/types/dormitory";

type CheckLineAssignParamsType = {
  church: ChurchType;
  line: LineType;
};

function checkLineAssign({ church, line }: CheckLineAssignParamsType): boolean {
  let lineRemain = 0;

  line.rooms.forEach((room) => {
    lineRemain += room.remain;
  });

  if (lineRemain < church.people) {
    return false;
  }

  return true;
}

type GetAssignableInFloorParamsType = {
  church: ChurchType;
  floorIndex: number;
};

function getAssignableInFloor({ church, floorIndex }: GetAssignableInFloorParamsType) {
  const currentDormitory = useDormitoryStore.getState().dormitoryData;
  const { lines } = currentDormitory?.floors[floorIndex] as FloorType;

  const assignableLineIndexArray: number[] = [];

  lines.forEach((line, lineIndex) => {
    const isAssignable = checkLineAssign({ church, line });

    if (isAssignable) {
      assignableLineIndexArray.push(lineIndex);
    }
  });

  return assignableLineIndexArray;
}

type GetAssignableInDormitoryParamsType = {
  church: ChurchType;
};

function getAssignableInDormitory({ church }: GetAssignableInDormitoryParamsType) {
  // 실시간 최신 상태 가져오기
  const currentDormitory = useDormitoryStore.getState().dormitoryData;

  const { floors } = currentDormitory as DormitoryType;
  const assignableFloorIndexArray: { floorIndex: number; lineIndexArray: number[] }[] = [];

  floors.forEach((_, floorIndex) => {
    const assignableLineIndexArray = getAssignableInFloor({ church, floorIndex });

    if (assignableLineIndexArray.length > 0) {
      assignableFloorIndexArray.push({ floorIndex: floorIndex, lineIndexArray: assignableLineIndexArray });
    }
  });

  return assignableFloorIndexArray;
}

export { checkLineAssign, getAssignableInFloor, getAssignableInDormitory };
