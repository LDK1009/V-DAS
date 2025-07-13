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

type DormitorySexType = {
  sex: "male" | "female";
  useFloorNumbers: number[];
  floors: FloorType[];
};

type DormitoryType = {
  male: DormitorySexType;
  female: DormitorySexType;
};

export type { RoomType, LineType, FloorType, DormitorySexType, DormitoryType };
