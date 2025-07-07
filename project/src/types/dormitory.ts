import { ChurchArrayType } from "./currentChurchType";


type RoomType = {
  max: number;
  current: number;
  remain: number;
  assignedChurchArray: ChurchArrayType;
};

type LineType = {
  rooms: RoomType[];
};

type FloorType = {
  floorNumber: number;
  lines: LineType[];
};

type DormitoryType = {
  floors: FloorType[];
};

export type { RoomType, LineType, FloorType, DormitoryType };
