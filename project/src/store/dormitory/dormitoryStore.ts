import { DormitoryType, FloorType, LineType, RoomType } from "@/types/dormitory";
import { create } from "zustand";

// Zustand 스토어 정의

type DormitoryStoreType = {
  ////////// 기숙사 데이터 관련
  dormitoryData: DormitoryType | null;
  setDormitoryData: (dormitoryData: DormitoryType | null) => void;
  initDormitoryData: () => void;
  ////////// 현재 층 관련
  currentFloor: number;
  setCurrentFloor: (floor: number) => void;
};

////////// 방 초기화
const initialRoom: RoomType = {
  max: 7,
  current: 0,
  remain: 7,
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

////////// 기숙사 초기화
const initialDormitory: DormitoryType = {
  floors: Array.from({ length: 9 }, (_, index) => ({
      ...initialFloor,
      floorNumber: index,
  })),
};

export const useDormitoryStore = create<DormitoryStoreType>()((set) => ({
  // 기숙사 데이터
  dormitoryData: initialDormitory,
  // 기숙사 데이터 설정
  setDormitoryData: (dormitoryData) => set({ dormitoryData }),
  // 기숙사 데이터 초기화
  initDormitoryData: () => set({ dormitoryData: initialDormitory }),

  // 현재 보고있는 층
  currentFloor: 0,
  // 현재 보고있는 층 변경
  setCurrentFloor: (floor) => set({ currentFloor: floor }),
}));
