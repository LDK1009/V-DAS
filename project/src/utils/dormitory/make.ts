import { LineType, FloorType, RoomType } from "@/types/dormitory";

////////// 방 초기화
const initialRoom: RoomType = {
  max: 6,
  current: 0,
  remain: 6,
  assignedChurchArray: [],
};

////////// 라인 초기화
const initialLine1: LineType = {
  rooms: Array.from({ length: 6 }, () => ({ ...initialRoom })),
};
const initialLine2: LineType = {
  rooms: Array.from({ length: 4 }, () => ({ ...initialRoom })),
};
const initialLine3: LineType = {
  rooms: Array.from({ length: 5 }, () => ({ ...initialRoom })),
};
const initialLine4: LineType = {
  rooms: Array.from({ length: 6 }, () => ({ ...initialRoom })),
};
const initialLine5: LineType = {
  rooms: Array.from({ length: 16 }, () => ({ ...initialRoom })),
};

////////// 층 초기화
const initialFloor: FloorType = {
  floorNumber: 0,
  lines: [initialLine1, initialLine2, initialLine3, initialLine4, initialLine5],
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type GetDormitoryParamsType = {
  sex: "male" | "female";
  useFloorNumbers: number[];
};

export function getDormitory({ sex, useFloorNumbers }: GetDormitoryParamsType) {
  const floors = useFloorNumbers.map((floorNumber) => {
    return {
      ...initialFloor,
      floorNumber: floorNumber,
    };
  });

  return {
    sex,
    useFloorNumbers,
    floors,
  };
}
