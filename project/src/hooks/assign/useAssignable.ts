import { useCurrentChurchStore } from "@/store/church/churchStore";
import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { ChurchType } from "@/types/currentChurchType";
import { DormitoryType, FloorType, LineType } from "@/types/dormitory";
//////////////////////////////////////////////////////////////////////////////// 사용중 ////////////////////////////////////////////////////////////////////////////////
//////////////////// 남은 배정 가능 인원을 통한 기숙사 내 모든 방 조회
function getAssignableRoomWithRemain(remain: number) {
  const { dormitoryData } = useDormitoryStore.getState();
  const { floors } = dormitoryData as DormitoryType;

  for (const floor of floors) {
    const { lines } = floor;
    for (const [lineIndex, line] of lines.entries()) {
      const { rooms } = line;
      for (const [roomIndex, room] of rooms.entries()) {
        if (room.remain === remain) {
          return {
            floorIndex: floor.floorNumber,
            lineIndex: lineIndex,
            roomIndex: roomIndex,
          };
        }
      }
    }
  }

  return null;
}

//////////////////// 마지막 배정된 방 남은 인원 조회
type GetLastAssignedRoomRemainParamsType = {
  floorIndex: number;
  lineIndex: number;
};

function getLastAssignedRoomRemain({ floorIndex, lineIndex }: GetLastAssignedRoomRemainParamsType) {
  const { dormitoryData } = useDormitoryStore.getState();
  const { maxRoomPeople } = useDormitoryStore.getState();
  const line = dormitoryData?.floors[floorIndex].lines[lineIndex] as LineType;
  const reverseRooms = [...line.rooms].reverse();

  // 마지막 방부터 인원이 배정된 방이 있는지 확인 후 남은 인원 반환
  for (const [index, room] of reverseRooms.entries()) {
    const { current, remain } = room;
    // 해당 방에 배정된 인원이 0보다 크다면
    if (current > 0) {
      // 해당 방에 배정된 인원이 최대 인원과 같다면
      if (current === maxRoomPeople) {
        return index + 1 < line.rooms.length ? line.rooms[index + 1].remain : 0;
      }

      return remain;
    }
  }

  return 0;
}

//////////////////// 라인 잔여 인원 조회
type GetLineRemainParamsType = {
  line: LineType;
};

function getLineRemain({ line }: GetLineRemainParamsType) {
  let lineRemain = 0;
  line.rooms.forEach((room) => {
    lineRemain += room.remain;
  });

  return lineRemain;
}

//////////////////// 기숙사 내 모든 배정 가능 라인 조회
type GetAssignableInDormitoryParamsType = {
  church: ChurchType;
};

type AssignableFloorIndexArrayType = { floorIndex: number; lineInfoArray: LineInfoType[] }[];

function getAssignableInDormitory({ church }: GetAssignableInDormitoryParamsType) {
  // 실시간 최신 상태 가져오기
  const currentDormitory = useDormitoryStore.getState().dormitoryData;

  const { floors } = currentDormitory as DormitoryType;
  const assignableFloorIndexArray: AssignableFloorIndexArrayType = [];

  floors.forEach((_, floorIndex) => {
    const assignableLineIndexArray = getAssignableInFloor({ church, floorIndex });

    if (assignableLineIndexArray.length > 0) {
      assignableFloorIndexArray.push({ floorIndex: floorIndex, lineInfoArray: assignableLineIndexArray });
    }
  });

  if (assignableFloorIndexArray.length === 0) {
    return null;
  }

  return assignableFloorIndexArray;
}

//////////////////// 기숙사 내 모든 배정 가능 중 나머지가 남지 않는 라인 조회
type GetAssignableFloorsWithNoTailLineParamsType = {
  church: ChurchType;
};

function getAssignableFloorsWithNoTailLine({ church }: GetAssignableFloorsWithNoTailLineParamsType) {
  const assignableFloors = getAssignableInDormitory({ church }) as AssignableFloorIndexArrayType;
  const { maxRoomPeople } = useDormitoryStore.getState();
  const churchPeople = church.people;
  const churchRemain = churchPeople % maxRoomPeople;

  const assignableFloorsWithNoTailLine = assignableFloors
    .map((floorInfo) => {
      const lineInfos = floorInfo.lineInfoArray;
      const newLineInfos = lineInfos.filter((lineInfo) => {
        const { lineRemain } = lineInfo;
        const lineRemainMod = lineRemain % maxRoomPeople;
        const isCombination = lineRemainMod === churchRemain;
        const isLineNoTail = lineRemainMod === 0;

        return isLineNoTail || isCombination;
      });

      return {
        floorIndex: floorInfo.floorIndex,
        lineInfoArray: newLineInfos,
      };
    })
    .filter((floorInfo) => {
      return floorInfo.lineInfoArray.length > 0;
    });

  return assignableFloorsWithNoTailLine.length > 0 ? assignableFloorsWithNoTailLine : null;
}

//////////////////// 기숙사 내 모든 배정 가능 중 조합의 차이값에 따른 라인 조회

type GetAssignableFloorsByCombinationDifferenceParamsType = {
  church: ChurchType;
  difference: number;
};

function getAssignableFloorsByCombinationDifference({
  church,
  difference,
}: GetAssignableFloorsByCombinationDifferenceParamsType) {
  const assignableFloors = getAssignableInDormitory({ church }) as AssignableFloorIndexArrayType;
  const { maxRoomPeople } = useDormitoryStore.getState();
  const churchPeople = church.people;
  const churchRemain = churchPeople % maxRoomPeople;

  const assignableFloorsByCombinationDifference = assignableFloors
    .map((floorInfo) => {
      const lineInfos = floorInfo.lineInfoArray;
      const newLineInfos = lineInfos.filter((lineInfo) => {
        const { lineRemain } = lineInfo;
        const lineRemainMod = lineRemain % maxRoomPeople;
        const combinationDifference = maxRoomPeople - (lineRemainMod + churchRemain);

        return combinationDifference === difference;
      });

      return {
        floorIndex: floorInfo.floorIndex,
        lineInfoArray: newLineInfos,
      };
    })
    .filter((floorInfo) => {
      return floorInfo.lineInfoArray.length > 0;
    });

  return assignableFloorsByCombinationDifference;
}

//////////////////// 조회값을 5라인과 나머지로 분리

function separateAssignFloorsToFiveLinesAndOthers(assignableFloors: AssignableFloorIndexArrayType) {
  const fiveLines = assignableFloors
    .map((floorInfo) => {
      const { floorIndex, lineInfoArray } = floorInfo;
      const lineFives = lineInfoArray.filter((lineInfo) => {
        const { lineIndex } = lineInfo;
        return lineIndex === 4;
      });

      return {
        floorIndex: floorIndex,
        lineInfoArray: lineFives,
      };
    })
    .filter((floorInfo) => {
      return floorInfo.lineInfoArray.length > 0;
    });

  const otherLines = assignableFloors
    .map((floorInfo) => {
      const { floorIndex, lineInfoArray } = floorInfo;
      const lineFives = lineInfoArray.filter((lineInfo) => {
        const { lineIndex } = lineInfo;
        return lineIndex !== 4;
      });

      return {
        floorIndex: floorIndex,
        lineInfoArray: lineFives,
      };
    })
    .filter((floorInfo) => {
      return floorInfo.lineInfoArray.length > 0;
    });

  return {
    fiveLines: fiveLines.length === 0 ? null : fiveLines,
    otherLines: otherLines.length === 0 ? null : otherLines,
  };
}

//////////////////// 배정 위치 얻기
type GetAssignPointParamsType = {
  fiveLines: AssignableFloorIndexArrayType | null;
  otherLines: AssignableFloorIndexArrayType | null;
};

function getAssignPoint({ fiveLines, otherLines }: GetAssignPointParamsType) {
  if (fiveLines) {
    return {
      floorIndex: fiveLines[0].floorIndex,
      lineIndex: fiveLines[0].lineInfoArray[0].lineIndex,
    };
  }

  if (otherLines) {
    return {
      floorIndex: otherLines[0].floorIndex,
      lineIndex: otherLines[0].lineInfoArray.slice(-1)[0].lineIndex,
    };
  }

  return null;
}

//////////////////// 꼬리 없는 배정 위치 얻기
type GetAssignPointWithNoTailLineParamsType = {
  church: ChurchType;
};

function getAssignPointWithNoTailLine({ church }: GetAssignPointWithNoTailLineParamsType) {
  const assignableData = getAssignableFloorsWithNoTailLine({ church });
  const seperatedData = separateAssignFloorsToFiveLinesAndOthers(assignableData as AssignableFloorIndexArrayType);
  const assignPoint = getAssignPoint(seperatedData);

  if (assignPoint) {
    return assignPoint;
  }

  return null;
}

//////////////////// 조합 차이값에 따른 배정 위치 조회
type GetAssignablePointByCombinationDifferenceParamsType = {
  church: ChurchType;
  difference: number;
};

function getAssignablePointByCombinationDifference({
  church,
  difference,
}: GetAssignablePointByCombinationDifferenceParamsType) {
  const assignableData = getAssignableFloorsByCombinationDifference({ church, difference });
  const seperatedData = separateAssignFloorsToFiveLinesAndOthers(assignableData);
  const assignPoint = getAssignPoint(seperatedData);

  if (assignPoint) {
    return assignPoint;
  }

  return null;
}

//////////////////// 짝꿍 교회 조회

type GetPartnerChurchParamsType = {
  sex: "male" | "female";
  floorIndex: number;
  lineIndex: number;
};

function getPartnerChurch({ sex, floorIndex, lineIndex }: GetPartnerChurchParamsType) {
  const { churchMaleArray, churchFemaleArray } = useCurrentChurchStore.getState();
  const { maxRoomPeople } = useDormitoryStore.getState();

  const lineRemain = getLastAssignedRoomRemain({ floorIndex, lineIndex });
  const lineNeed = lineRemain % maxRoomPeople;

  if (sex === "male") {
    if (!churchMaleArray || churchMaleArray.length === 0) {
      return null;
    }

    const filteredChurchs = churchMaleArray.filter((church) => {
      const churchMod = church.people % maxRoomPeople;
      return churchMod === lineNeed;
    });

    if (filteredChurchs.length > 0) {
      const church = filteredChurchs[0];
      console.log(`라인 남은 인원 : ${lineRemain} | 라인 필요 인원 : ${lineNeed}`);
      console.log(
        `[짝꿍 교회] : ${church.churchName} | 인원 : ${church.people} | 나머지 : ${church.people % maxRoomPeople}`
      );
    }

    return filteredChurchs.length > 0 ? filteredChurchs[0] : null;
  }

  if (sex === "female") {
    if (!churchFemaleArray || churchFemaleArray.length === 0) {
      return null;
    }

    const filteredChurchs = churchFemaleArray?.filter((church) => {
      const churchMod = church.people % maxRoomPeople;
      return churchMod === lineNeed;
    });

    return filteredChurchs.length > 0 ? filteredChurchs[0] : null;
  }

  return null;
}

//////////////////////////////////////////////////////////////////////////////// 미사용중 ////////////////////////////////////////////////////////////////////////////////

//////////////////// 라인 배정 가능 여부 조회

type CheckLineAssignParamsType = {
  church: ChurchType;
  line: LineType;
};

function checkLineAssign({ church, line }: CheckLineAssignParamsType): { isAssignable: boolean; lineRemain: number } {
  let lineRemain = 0;

  line.rooms.forEach((room) => {
    lineRemain += room.remain;
  });

  if (lineRemain < church.people) {
    return { isAssignable: false, lineRemain: lineRemain };
  }

  return { isAssignable: true, lineRemain: lineRemain };
}

//////////////////// 배정 가능 층 조회

type GetAssignableInFloorParamsType = {
  church: ChurchType;
  floorIndex: number;
};

type LineInfoType = {
  lineIndex: number;
  lineRemain: number;
};

function getAssignableInFloor({ church, floorIndex }: GetAssignableInFloorParamsType) {
  const currentDormitory = useDormitoryStore.getState().dormitoryData;
  const { lines } = currentDormitory?.floors[floorIndex] as FloorType;

  const assignableLineInfoArray: LineInfoType[] = [];

  lines.forEach((line, lineIndex) => {
    const { isAssignable, lineRemain } = checkLineAssign({ church, line });

    if (isAssignable) {
      assignableLineInfoArray.push({ lineIndex: lineIndex, lineRemain: lineRemain });
    }
  });

  return assignableLineInfoArray;
}

//////////////////// 추천 배정 위치 조회

type GetRecommendedAssignmentPointParamsType = {
  church: ChurchType;
};

function getRecommendedAssignmentPoint({ church }: GetRecommendedAssignmentPointParamsType) {
  const assignableFloorIndexArray = getAssignableInDormitory({ church });

  // 추천 배정 위치(저층의 마지막 라인)
  if (assignableFloorIndexArray && assignableFloorIndexArray.length > 0) {
    const recommendedAssignmentPoint = {
      floorIndex: assignableFloorIndexArray[0].floorIndex,
      lineIndex: assignableFloorIndexArray[0].lineInfoArray.slice(-1)[0].lineIndex,
    };

    return recommendedAssignmentPoint;
  }

  return null;
}

//////////////////// 핏한 배정 위치 조회

type GetFitAssignPointParamsType = {
  church: ChurchType;
};

function getFitAssignPoint({ church }: GetFitAssignPointParamsType) {
  // 방 최대 인원 가져오기
  const { maxRoomPeople } = useDormitoryStore.getState();
  // 교회의 나머지 인원
  const churchRemain = church.people % maxRoomPeople;

  // console.log(`${church.churchName} 모든 배정 가능 라인 \n ${JSON.stringify(assignableFloorIndexArray, null, 2)}`);

  // 모든 배정 가능 라인 조회
  const assignableFloorIndexArray = getAssignableInDormitory({ church });

  // 배정 가능 라인이 없을때
  if (!assignableFloorIndexArray || assignableFloorIndexArray.length === 0) {
    return null;
  }

  // 배정 가능 라인의 배정 가능 인원을 나머지 인원으로 변경
  const lineModArray = assignableFloorIndexArray.map((floorInfo) => {
    const floorIndex = floorInfo.floorIndex;
    const newLineInfoArray = floorInfo.lineInfoArray.map((lineInfo) => ({
      lineIndex: lineInfo.lineIndex,
      lineMod: lineInfo.lineRemain % maxRoomPeople,
    }));

    return {
      floorIndex: floorIndex,
      lineInfoArray: newLineInfoArray,
    };
  });

  console.log(`${church.churchName} 교회 배정 가능 라인의 나머지 인원 \n ${JSON.stringify(lineModArray, null, 2)}`);

  /////////////////////////////////////////////////////////////////////
  // 핏 O 같은 방 배정 O
  for (const floorInfo of lineModArray) {
    const { lineInfoArray } = floorInfo;
    const { floorIndex } = floorInfo;

    for (const lineInfo of lineInfoArray) {
      const { lineMod } = lineInfo;
      const { lineIndex } = lineInfo;

      if (lineMod === churchRemain) {
        console.log(`${church.churchName} 배정 위치 ${floorIndex}층 ${lineIndex}라인 | 이어서 배치`);

        return {
          assignType: "sequence",
          floorIndex,
          lineIndex,
        };
      }
    }
  }

  // 핏 X 같은 방 배정 O
  for (const floorInfo of lineModArray) {
    const { lineInfoArray } = floorInfo;
    const { floorIndex } = floorInfo;

    for (const lineInfo of lineInfoArray) {
      const { lineMod } = lineInfo;
      const { lineIndex } = lineInfo;

      if (lineMod > churchRemain) {
        console.log(`${church.churchName} 배정 위치 ${floorIndex}층 ${lineIndex}라인 | 이어서 배치`);

        return {
          assignType: "sequence",
          floorIndex,
          lineIndex,
        };
      }
    }
  }

  // 핏 X 같은 방 배정 X
  for (const floorInfo of lineModArray) {
    const { lineInfoArray } = floorInfo;
    const { floorIndex } = floorInfo;

    for (const lineInfo of lineInfoArray) {
      const { lineMod } = lineInfo;
      const { lineIndex } = lineInfo;

      if (lineMod < churchRemain) {
        console.log(`${church.churchName} 배정 위치 ${floorIndex}층 ${lineIndex}라인 | 다음방 배치`);

        return {
          assignType: "next",
          floorIndex,
          lineIndex,
        };
      }
    }
  }

  return null;
}

export {
  getLastAssignedRoomRemain,
  getLineRemain,
  checkLineAssign,
  getAssignableInFloor,
  getAssignableInDormitory,
  getAssignableFloorsWithNoTailLine,
  getAssignableFloorsByCombinationDifference,
  separateAssignFloorsToFiveLinesAndOthers,
  getPartnerChurch,
  getAssignPoint,
  getAssignPointWithNoTailLine,
  getAssignablePointByCombinationDifference,
  getRecommendedAssignmentPoint,
  getFitAssignPoint,
  getAssignableRoomWithRemain,
};
