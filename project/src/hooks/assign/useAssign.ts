import { useCurrentChurchStore } from "@/store/church/churchStore";
import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { ChurchType } from "@/types/currentChurchType";
import { LineType, RoomType } from "@/types/dormitory";
import { getLineRemain } from "./useAssignable";

export const useAssign = () => {
  const { updateRoomCurrentAndRemain, dormitoryData } = useDormitoryStore();
  const { evacuateChurchMale, evacuateChurchFemale } = useCurrentChurchStore();

  type AssignRoomParamsType = {
    sex: "male" | "female";
    church: ChurchType;
    count: number;
    floorIndex: number;
    lineIndex: number;
    roomIndex: number;
  };

  ////////// 방 배정
  function assignRoom({ sex, church, count, floorIndex, lineIndex, roomIndex }: AssignRoomParamsType) {
    if (sex === "male") {
      evacuateChurchMale(church.churchName, count);
    } else {
      evacuateChurchFemale(church.churchName, count);
    }
    updateRoomCurrentAndRemain({ church, count, floorIndex, lineIndex, roomIndex });
  }

  type AssignLineParamsType = {
    sex: "male" | "female";
    church: ChurchType;
    floorIndex: number;
    lineIndex: number;
  };

  ////////// 라인 배정
  function assignLine({ sex, church, floorIndex, lineIndex }: AssignLineParamsType) {
    const currentDormitory = useDormitoryStore.getState().dormitoryData;

    const targetLine = currentDormitory?.floors[floorIndex].lines[lineIndex];
    const targetLineRooms = targetLine?.rooms as RoomType[];

    let churchPeople = church.people;

    for (const [roomIndex, room] of targetLineRooms.entries()) {
      const roomRemain = room.remain;

      if (roomRemain > 0 && churchPeople > 0) {
        if (roomRemain < churchPeople) {
          assignRoom({ sex, church, count: roomRemain, floorIndex, lineIndex, roomIndex });
          churchPeople -= roomRemain;
        } else {
          assignRoom({ sex, church, count: churchPeople, floorIndex, lineIndex, roomIndex });
          churchPeople = 0;
        }
      }
    }

    return dormitoryData;
  }

  function assignLineStartFromNextRoom({ sex, church, floorIndex, lineIndex }: AssignLineParamsType) {
    const currentDormitory = useDormitoryStore.getState().dormitoryData;
    const { maxRoomPeople } = useDormitoryStore.getState();
    const line = currentDormitory?.floors[floorIndex].lines[lineIndex] as LineType;
    const lineRemain = getLineRemain({ line });
    const needRoomCount = Math.ceil(church.people / maxRoomPeople);

    const startRoomIndex = line.rooms.length - Math.floor(lineRemain / maxRoomPeople);
    const endRoomIndex = startRoomIndex + needRoomCount;

    ///////////////////////////////////////////////////////////////

    let churchPeople = church.people;

    for (let i = startRoomIndex; i < endRoomIndex; i++) {
      const roomIndex = i;

      if (churchPeople >= maxRoomPeople) {
        assignRoom({ sex, church, count: maxRoomPeople, floorIndex, lineIndex, roomIndex });
      }

      assignRoom({ sex, church, count: churchPeople, floorIndex, lineIndex, roomIndex });
      churchPeople = churchPeople - churchPeople;
    }
    // for (let i = startRoomIndex; i < endRoomIndex; i++) {
    //   let churchPeople = church.people;

    //   if (roomRemain < churchPeople) {
    //     assignRoom({ sex, church, count: roomRemain, floorIndex, lineIndex, roomIndex:i });
    //     churchPeople -= roomRemain;
    //   } else {
    //     assignRoom({ sex, church, count: churchPeople, floorIndex, lineIndex, roomIndex });
    //     churchPeople = 0;
    //   }
    // }

    return dormitoryData;
  }

  return { assignRoom, assignLine, assignLineStartFromNextRoom };
};
