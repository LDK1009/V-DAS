import { useCurrentChurchStore } from "@/store/church/churchStore";
import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { ChurchType } from "@/types/currentChurchType";
import { LineType, RoomType } from "@/types/dormitory";
import {
  getAssignablePointByCombinationDifference,
  getAssignableRoomWithRemain,
  getAssignPointWithNoTailLine,
  getLastAssignedRoomRemain,
  getPartnerChurch,
} from "./useAssignable";

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

  ////////// 마지막 배정된 방의 다음 방부터 배정
  function assignLineStartFromNextRoom({ sex, church, floorIndex, lineIndex }: AssignLineParamsType) {
    const currentDormitory = useDormitoryStore.getState().dormitoryData;
    const { maxRoomPeople } = useDormitoryStore.getState();
    const line = currentDormitory?.floors[floorIndex].lines[lineIndex] as LineType;
    const lineRemain = getLastAssignedRoomRemain({ floorIndex, lineIndex });
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

  ////////// 자동 배정
  type AutoAssignParamsType = {
    sex: "male" | "female";
    church: ChurchType;
  };

  function autoAssign({ sex, church }: AutoAssignParamsType) {
    ////////// 꼬리 없는 배정
    const assignPoint = getAssignPointWithNoTailLine({ church });

    if (assignPoint) {
      console.log(
        `[꼬리 없는 배정] ${church.churchName} 배정 위치 : ${assignPoint.floorIndex + 1}층 ${
          assignPoint.lineIndex + 1
        }라인`
      );
      assignLine({ sex, church, floorIndex: assignPoint.floorIndex, lineIndex: assignPoint.lineIndex });

      ////////// 짝꿍 교회 배정
      const partnerChurch = getPartnerChurch({
        sex,
        floorIndex: assignPoint.floorIndex,
        lineIndex: assignPoint.lineIndex,
      });

      if (partnerChurch) {
        assignLine({
          sex,
          church: partnerChurch,
          floorIndex: assignPoint.floorIndex,
          lineIndex: assignPoint.lineIndex,
        });
      }

      return;
    }

    const assignPointByCombinationDifference1 = getAssignablePointByCombinationDifference({ church, difference: 1 });
    console.log("조합하여 6명이 되는 배정", assignPointByCombinationDifference1);
    ////////// 조합하여 6명이 되는 배정
    if (assignPointByCombinationDifference1) {
      assignLine({
        sex,
        church,
        floorIndex: assignPointByCombinationDifference1.floorIndex,
        lineIndex: assignPointByCombinationDifference1.lineIndex,
      });

      return;
    }

    ////////// 조합하여 5명이 되는 배정

    const assignPointByCombinationDifference2 = getAssignablePointByCombinationDifference({ church, difference: 2 });
    console.log("조합하여 5명이 되는 배정", assignPointByCombinationDifference2);

    if (assignPointByCombinationDifference2) {
      assignLine({
        sex,
        church,
        floorIndex: assignPointByCombinationDifference2.floorIndex,
        lineIndex: assignPointByCombinationDifference2.lineIndex,
      });

      return;
    }
  }

  ////////// 작은 교회 배정
  function assignSmallChurch({ sex, church }: { sex: "male" | "female"; church: ChurchType }) {
    const assignableRoomPoint = getAssignableRoomWithRemain(church.people);

    if (!assignableRoomPoint) {
      console.log(`[작은 교회 배정] ${church.churchName} 배정 위치 : 배정 불가능`);
      return;
    }

    console.log(`[작은 교회 배정] ${church.churchName} 배정 위치 : 배정 불가능`);

    assignRoom({
      sex,
      church,
      count: church.people,
      floorIndex: assignableRoomPoint.floorIndex,
      lineIndex: assignableRoomPoint.lineIndex,
      roomIndex: assignableRoomPoint.roomIndex,
    });
  }

  return {
    assignRoom,
    assignLine,
    assignLineStartFromNextRoom,
    autoAssign,
    assignSmallChurch,
  };
};
