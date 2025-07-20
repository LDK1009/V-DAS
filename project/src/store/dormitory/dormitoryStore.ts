import { DormitoryType, FloorType, LineType, RoomType } from "@/types/dormitory";
import { create } from "zustand";
import { produce } from "immer";
import { ChurchType } from "@/types/currentChurchType";
import { getDormitory } from "@/utils/dormitory/make";
import { useCurrentChurchStore } from "@/store/church/churchStore";

////////// 기숙사 초기화
const initialDormitory: DormitoryType = {
  male: getDormitory({ sex: "male", useFloorNumbers: [2, 3, 4, 5] }),
  female: getDormitory({ sex: "female", useFloorNumbers: [6, 7, 8, 9] }),
};

type AssignRoomParamsType = {
  sex: "male" | "female";
  church: ChurchType;
  count: number;
  floorIndex: number;
  lineIndex: number;
  roomIndex: number;
};

type AddPeopleToRoomParamsType = {
  sex: "male" | "female";
  floorIndex: number;
  lineIndex: number;
  roomIndex: number;
  count: number;
};

type SubPeopleFromRoomParamsType = {
  sex: "male" | "female";
  floorIndex: number;
  lineIndex: number;
  roomIndex: number;
  count: number;
};

type ChangeAssignedChurchPeopleParamsType = {
  sex: "male" | "female";
  floorIndex: number;
  lineIndex: number;
  roomIndex: number;
  church: ChurchType;
  count: number;
};

type CloseRoomParamsType = {
  sex: "male" | "female";
  floorIndex: number;
  lineIndex: number;
  roomIndex: number;
};

type OpenRoomParamsType = {
  sex: "male" | "female";
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
  // 사용층 관련
  setUseFloor: (sex: "male" | "female", useFloorNumbers: number[]) => void;

  // 현재 층 관련
  currentFloor: number;
  setCurrentFloor: (floor: number) => void;

  // 설정값 관련
  maxRoomPeople: number;
  setMaxRoomPeople: (maxRoomPeople: number) => void;
  maxFloor: number;
  setMaxFloor: (maxFloor: number) => void;

  // 방 인원 빼기 관련
  updateRoomCurrentAndRemain: ({ sex, church, count, floorIndex, lineIndex, roomIndex }: AssignRoomParamsType) => void;

  // 방 인원 추가
  addPeopleToRoom: ({ sex, floorIndex, lineIndex, roomIndex, count }: AddPeopleToRoomParamsType) => void;
  // 방 인원 빼기
  subPeopleFromRoom: ({ sex, floorIndex, lineIndex, roomIndex, count }: SubPeopleFromRoomParamsType) => void;

  // 방 폐쇄
  closeRoom: ({ sex, floorIndex, lineIndex, roomIndex }: CloseRoomParamsType) => void;
  // 방 개방
  openRoom: ({ sex, floorIndex, lineIndex, roomIndex }: OpenRoomParamsType) => void;
  
  // 배정된 교회의 인원 변경
  changeAssignedChurchPeople: ({
    sex,
    floorIndex,
    lineIndex,
    roomIndex,
    church,
    count,
  }: ChangeAssignedChurchPeopleParamsType) => void;
};

export const useDormitoryStore = create<DormitoryStoreType>()((set) => ({
  // 기숙사 데이터
  dormitoryData: initialDormitory,
  // 기숙사 데이터 설정
  setDormitoryData: (dormitoryData) => set({ dormitoryData }),
  // 기숙사 데이터 초기화
  initDormitoryData: () => set({ dormitoryData: initialDormitory }),

  // 사용층 설정
  setUseFloor: (sex: "male" | "female", useFloorNumbers: number[]) => {
    set(
      produce((state) => {
        const dormitoryData = state.dormitoryData;
        if (dormitoryData) {
          dormitoryData[sex].useFloorNumbers = useFloorNumbers;
        }
      })
    );
  },

  updateRoomCurrentAndRemain: ({ sex, church, count, floorIndex, lineIndex, roomIndex }: AssignRoomParamsType) => {
    set(
      produce((state) => {
        const dormitoryData = state.dormitoryData;
        const targetRoom = dormitoryData?.[sex].floors[floorIndex].lines[lineIndex].rooms[roomIndex];
        const roomRemain = targetRoom.remain - count;
        const roomCurrent = targetRoom.current + count;

        if (church.people < 0) {
          return;
        }

        // 데이터 존재 여부 확인
        if (dormitoryData) {
          dormitoryData[sex].floors[floorIndex].lines[lineIndex].rooms[roomIndex].remain = roomRemain;
          dormitoryData[sex].floors[floorIndex].lines[lineIndex].rooms[roomIndex].current = roomCurrent;

          // 이미 배정된 교회 존재 여부 확인
          const existChurch = targetRoom.assignedChurchArray.find(
            (assignedChurch: ChurchType) => assignedChurch.churchName === church.churchName
          );

          // 이미 배정된 교회 존재 시 인원 추가
          if (existChurch) {
            const newPeople = existChurch.people + count;
            // 인원이 0이 된다면 교회 배정 삭제
            if (newPeople === 0) {
              targetRoom.assignedChurchArray = targetRoom.assignedChurchArray.filter(
                (assignedChurch: ChurchType) => assignedChurch.churchName !== church.churchName
              );
            } else {
              existChurch.people = newPeople;
            }
          } else {
            // 배정된 교회 없으면 배정
            targetRoom.assignedChurchArray.push({ ...church, people: count });
          }
        }
      })
    );
  },

  // 방 인원 추가
  addPeopleToRoom: ({ sex, floorIndex, lineIndex, roomIndex, count }: AddPeopleToRoomParamsType) => {
    set(
      produce((state) => {
        const dormitoryData = state.dormitoryData;
        const targetRoom = dormitoryData?.[sex].floors[floorIndex].lines[lineIndex].rooms[roomIndex];
        targetRoom.current += count;
        targetRoom.remain -= count;

        return dormitoryData;
      })
    );
  },

  // 방 인원 빼기
  subPeopleFromRoom: ({ sex, floorIndex, lineIndex, roomIndex, count }: SubPeopleFromRoomParamsType) => {
    set(
      produce((state) => {
        const dormitoryData = state.dormitoryData;
        const targetRoom = dormitoryData?.[sex].floors[floorIndex].lines[lineIndex].rooms[roomIndex];
        targetRoom.current -= count;
        targetRoom.remain += count;
      })
    );
  },

  // 배정된 교회의 인원 변경
  changeAssignedChurchPeople: ({
    sex,
    floorIndex,
    lineIndex,
    roomIndex,
    church,
    count,
  }: ChangeAssignedChurchPeopleParamsType) => {
    set(
      produce((state) => {
        const dormitoryData = state.dormitoryData;
        const assignedChurch = dormitoryData?.[sex].floors[floorIndex].lines[lineIndex].rooms[
          roomIndex
        ].assignedChurchArray.find((assignedChurch: ChurchType) => assignedChurch.churchName === church.churchName);

        if (!assignedChurch) return;

        assignedChurch.people += count;
      })
    );
  },

  // 설정값 관련
  maxRoomPeople: 6,
  setMaxRoomPeople: (maxRoomPeople: number) => {
    // 최대 인원 설정
    set({ maxRoomPeople });
    // 기숙사 데이터 업데이트
    set(
      produce((state) => {
        const dormitoryData = state.dormitoryData;

        if (dormitoryData) {
          dormitoryData.male.floors.forEach((floor: FloorType) => {
            floor.lines.forEach((line: LineType) => {
              line.rooms.forEach((room: RoomType) => {
                room.max = maxRoomPeople;
                room.remain = maxRoomPeople;
              });
            });
          });

          dormitoryData.female.floors.forEach((floor: FloorType) => {
            floor.lines.forEach((line: LineType) => {
              line.rooms.forEach((room: RoomType) => {
                room.max = maxRoomPeople;
                room.remain = maxRoomPeople;
              });
            });
          });
        }
      })
    );
  },

  // 방 폐쇄
  closeRoom: ({ sex, floorIndex, lineIndex, roomIndex }: CloseRoomParamsType) => {
    const { evacuateChurchMale, evacuateChurchFemale } = useCurrentChurchStore.getState();

    set(
      produce((state) => {
        const targetRoom: RoomType = state.dormitoryData?.[sex].floors[floorIndex].lines[lineIndex].rooms[roomIndex];
        const targetRoomAssignedChurch = targetRoom.assignedChurchArray;

        if (targetRoomAssignedChurch.length > 0) {
          targetRoomAssignedChurch.forEach((assignedChurch: ChurchType) => {
            if (sex === "male") {
              evacuateChurchMale(assignedChurch.churchName, -assignedChurch.people);
            }
            if (sex === "female") {
              evacuateChurchFemale(assignedChurch.churchName, -assignedChurch.people);
            }
          });
        }

        if (targetRoom) {
          targetRoom.max = 0;
          targetRoom.current = 0;
          targetRoom.remain = 0;
          targetRoom.assignedChurchArray = [];
        }
      })
    );
  },

  // 방 개방
  openRoom: ({ sex, floorIndex, lineIndex, roomIndex }: OpenRoomParamsType) => {
    set(
      produce((state) => {
        const { maxRoomPeople } = state;
        const targetRoom: RoomType = state.dormitoryData?.[sex].floors[floorIndex].lines[lineIndex].rooms[roomIndex];

        if (targetRoom) {
          targetRoom.max = maxRoomPeople;
          targetRoom.current = 0;
          targetRoom.remain = maxRoomPeople;
          targetRoom.assignedChurchArray = [];
        }
      })
    );
  },

  maxFloor: 9,
  setMaxFloor: (maxFloor: number) => set({ maxFloor }),

  // 현재 보고있는 층
  currentFloor: 2,
  // 현재 보고있는 층 변경
  setCurrentFloor: (floor) => set({ currentFloor: floor }),
}));
