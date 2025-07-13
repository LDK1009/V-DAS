import { DormitoryType } from "@/types/dormitory";
import { create } from "zustand";
import { produce } from "immer";
import { ChurchType } from "@/types/currentChurchType";
import { getDormitory } from "@/utils/dormitory/make";

////////// 기숙사 초기화
const initialDormitory: DormitoryType = {
  male: getDormitory({ sex: "male", useFloorNumbers: [0, 1, 2, 3] }),
  female: getDormitory({ sex: "female", useFloorNumbers: [4, 5, 6, 7] }),
};

type AssignRoomParamsType = {
  sex: "male" | "female";
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
  updateRoomCurrentAndRemain: ({ sex,   church, count, floorIndex, lineIndex, roomIndex }: AssignRoomParamsType) => void;
};

export const useDormitoryStore = create<DormitoryStoreType>()((set) => ({
  // 기숙사 데이터
  dormitoryData: initialDormitory,
  // 기숙사 데이터 설정
  setDormitoryData: (dormitoryData) => set({ dormitoryData }),
  // 기숙사 데이터 초기화
  initDormitoryData: () => set({ dormitoryData: initialDormitory }),

  updateRoomCurrentAndRemain: ({ sex, church, count, floorIndex, lineIndex, roomIndex }: AssignRoomParamsType) => {
    set(
      produce((state) => {
        const dormitoryData = state.dormitoryData;
        const targetRoom = dormitoryData?.[sex].floors[floorIndex].lines[lineIndex].rooms[roomIndex];
        const roomRemain = targetRoom.remain - count;
        const roomCurrent = targetRoom.current + count;

        // 데이터 존재 여부 확인
        if (dormitoryData) {
          // 최대 인원 초과 시 배정 불가
          if (roomRemain < 0 || roomCurrent > 7) {
            return;
          } else {
            dormitoryData[sex].floors[floorIndex].lines[lineIndex].rooms[roomIndex].remain = roomRemain;
            dormitoryData[sex].floors[floorIndex].lines[lineIndex].rooms[roomIndex].current = roomCurrent;
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
