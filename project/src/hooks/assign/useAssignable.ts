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
  floor: FloorType;
};

function getAssignableInFloor({ church, floor }: GetAssignableInFloorParamsType) {
  const { lines } = floor;
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
  dormitory: DormitoryType;
};

function getAssignableInDormitory({ church, dormitory }: GetAssignableInDormitoryParamsType) {
  const { floors } = dormitory;
  const assignableFloorIndexArray: { floorIndex: number; lineIndexArray: number[] }[] = [];

  floors.forEach((floor, floorIndex) => {
    const assignableLineIndexArray = getAssignableInFloor({ church, floor });

    if (assignableLineIndexArray.length > 0) {
      assignableFloorIndexArray.push({ floorIndex: floorIndex, lineIndexArray: assignableLineIndexArray });
    }
  });

  return assignableFloorIndexArray;
}

export { checkLineAssign, getAssignableInFloor, getAssignableInDormitory };
