import { ChurchType } from "./currentChurchType";


type RoomType = {
  max: number;
  current: number;
  remain: number;
  assignedChurchArray: ChurchType[];
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
