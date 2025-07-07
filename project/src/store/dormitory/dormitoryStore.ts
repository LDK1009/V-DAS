import { DormitoryType, FloorType, LineType, RoomType } from "@/types/dormitory";
import { create } from "zustand";
import { produce } from "immer";
import { ChurchType } from "@/types/currentChurchType";

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
  // floors: Array.from({ length: 9 }, (_, index) => ({
  floors: Array.from({ length: 9 }, (_, index) => ({
    ...initialFloor,
    floorNumber: index,
  })),
};

type AssignRoomParamsType = {
  church: ChurchType;
  count: number;
  floorIndex: number;
  lineIndex: number;
  roomIndex: number;
};

////////// Zustand 스토어 정의
type DormitoryStoreType = {
  // 기숙사 데이터 관련
  dormitoryData: DormitoryType | null;
  setDormitoryData: (dormitoryData: DormitoryType | null) => void;
  initDormitoryData: () => void;
  // 현재 층 관련
  currentFloor: number;
  setCurrentFloor: (floor: number) => void;
  // 설정값 관련
  maxRoomPeople: number;
  setMaxRoomPeople: (maxRoomPeople: number) => void;
  maxFloor: number;
  setMaxFloor: (maxFloor: number) => void;

  // 방 인원 빼기 관련
  updateRoomCurrentAndRemain: ({ church, count, floorIndex, lineIndex, roomIndex }: AssignRoomParamsType) => void;
};

export const useDormitoryStore = create<DormitoryStoreType>()((set) => ({
  // 기숙사 데이터
  dormitoryData: initialDormitory,
  // 기숙사 데이터 설정
  setDormitoryData: (dormitoryData) => set({ dormitoryData }),
  // 기숙사 데이터 초기화
  initDormitoryData: () => set({ dormitoryData: initialDormitory }),

  updateRoomCurrentAndRemain: ({ church, count, floorIndex, lineIndex, roomIndex }: AssignRoomParamsType) => {
    set(
      produce((state) => {
        const dormitoryData = state.dormitoryData;
        const targetRoom = dormitoryData?.floors[floorIndex].lines[lineIndex].rooms[roomIndex];
        const roomRemain = targetRoom.remain - count;
        const roomCurrent = targetRoom.current + count;

        // 데이터 존재 여부 확인
        if (dormitoryData) {
          // 최대 인원 초과 시 배정 불가
          if (roomRemain < 0 || roomCurrent > 7) {
            return;
          } else {
            dormitoryData.floors[floorIndex].lines[lineIndex].rooms[roomIndex].remain = roomRemain;
            dormitoryData.floors[floorIndex].lines[lineIndex].rooms[roomIndex].current = roomCurrent;
            targetRoom.assignedChurchArray.push({ ...church, people: count });
          }
        }
      })
    );
  },

  // 설정값 관련
  maxRoomPeople: 7,
  setMaxRoomPeople: (maxRoomPeople: number) => set({ maxRoomPeople }),
  maxFloor: 9,
  setMaxFloor: (maxFloor: number) => set({ maxFloor }),

  // 현재 보고있는 층
  currentFloor: 0,
  // 현재 보고있는 층 변경
  setCurrentFloor: (floor) => set({ currentFloor: floor }),
}));
