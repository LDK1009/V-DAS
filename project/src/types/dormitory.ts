type AssignedChurchType = {
  name: string;
  people: number;
};

type RoomType = {
  max: number;
  current: number;
  remain: number;
  assignedChurchArray: AssignedChurchType[];
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
