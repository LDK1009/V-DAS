import { useCurrentChurchStore } from "@/store/church/churchStore";
import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { ChurchType } from "@/types/currentChurchType";
import { DormitorySexType, FloorType, LineType } from "@/types/dormitory";
//////////////////////////////////////////////////////////////////////////////// 사용중 ////////////////////////////////////////////////////////////////////////////////
//////////////////// 남은 배정 가능 인원을 통한 기숙사 내 모든 방 조회
function getAssignableRoomWithRemain(sex: "male" | "female", remain: number) {
  const { dormitoryData } = useDormitoryStore.getState();
  const { floors } = dormitoryData?.[sex] as DormitorySexType;

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

//////////////////// 마지막으로 배정된 방 인덱스 조회
function getLastAssignedRoomIndex(sex: "male" | "female", floorIndex: number, lineIndex: number) {
  const { dormitoryData } = useDormitoryStore.getState();
  const { lines } = dormitoryData?.[sex].floors[floorIndex] as FloorType;
  const { rooms } = lines[lineIndex];

  for (const [roomIndex, room] of [...rooms].reverse().entries()) {
    if (room.current > 0) {
      return rooms.length - 1 - roomIndex;
    }
  }

  return 0;
}

//////////////////// 마지막으로 배정된 방 이후의 남은 인원 조회
function getLastAssignedRoomRemainAfter(sex: "male" | "female", floorIndex: number, lineIndex: number) {
  const { dormitoryData } = useDormitoryStore.getState();
  const { lines } = dormitoryData?.[sex].floors[floorIndex] as FloorType;
  const { rooms } = lines[lineIndex];
  const startRoomIndex = getLastAssignedRoomIndex(sex, floorIndex, lineIndex);

  let remain = 0;

  for (const [roomIndex, room] of rooms.entries()) {
    if (roomIndex >= startRoomIndex) {
      remain += room.remain;
    }
  }

  return remain;
}

//////////////////// 마지막 배정된 방 남은 인원 조회
type GetLastAssignedRoomRemainParamsType = {
  sex: "male" | "female";
  floorIndex: number;
  lineIndex: number;
};

function getLastAssignedRoomRemain({ sex, floorIndex, lineIndex }: GetLastAssignedRoomRemainParamsType) {
  const lastAssignedRoomIndex = getLastAssignedRoomIndex(sex, floorIndex, lineIndex);
  const { dormitoryData } = useDormitoryStore.getState();
  const lastAssignedRoom = dormitoryData?.[sex].floors[floorIndex].lines[lineIndex].rooms[lastAssignedRoomIndex];
  const lastAssignedRoomRemain = lastAssignedRoom?.remain;

  return lastAssignedRoomRemain;
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
  sex: "male" | "female";
  church: ChurchType;
};

type AssignableFloorIndexArrayType = { floorIndex: number; lineInfoArray: LineInfoType[] }[];

function getAssignableInDormitory({ sex, church }: GetAssignableInDormitoryParamsType) {
  // 실시간 최신 상태 가져오기
  const currentDormitory = useDormitoryStore.getState().dormitoryData;

  const { floors } = currentDormitory?.[sex] as DormitorySexType;
  const assignableFloorIndexArray: AssignableFloorIndexArrayType = [];

  floors.forEach((_, floorIndex) => {
    const assignableLineIndexArray = getAssignableInFloor({ sex, church, floorIndex });

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
  sex: "male" | "female";
  church: ChurchType;
};

function getAssignableFloorsWithNoTailLine({ sex, church }: GetAssignableFloorsWithNoTailLineParamsType) {
  const assignableFloors = getAssignableInDormitory({ sex, church }) as AssignableFloorIndexArrayType;
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
  sex: "male" | "female";
  church: ChurchType;
  difference: number;
};

function getAssignableFloorsByCombinationDifference({
  sex,
  church,
  difference,
}: GetAssignableFloorsByCombinationDifferenceParamsType) {
  const assignableFloors = getAssignableInDormitory({ sex, church }) as AssignableFloorIndexArrayType;

  console.log("전체 배정 가능 라인", assignableFloors);
  const { maxRoomPeople } = useDormitoryStore.getState();
  const churchPeople = church.people;
  const churchMod = churchPeople % maxRoomPeople;

  const assignableFloorsByCombinationDifference = assignableFloors
    .map((floorInfo) => {
      const lineInfos = floorInfo.lineInfoArray;
      const newLineInfos = lineInfos.filter((lineInfo) => {
        const { lineRemain } = lineInfo;
        const lineMod = lineRemain % maxRoomPeople;
        const combinationDifference = lineMod - churchMod;

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

  return assignableFloorsByCombinationDifference.length > 0 ? assignableFloorsByCombinationDifference : null;
}

//////////////////// 조회값을 5라인과 나머지로 분리

function separateAssignFloorsToFiveLinesAndOthers(assignableFloors: AssignableFloorIndexArrayType) {
  if (!assignableFloors || assignableFloors.length === 0) {
    return {
      fiveLines: null,
      otherLines: null,
    };
  }

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
  sex: "male" | "female";
  church: ChurchType;
};

function getAssignPointWithNoTailLine({ sex, church }: GetAssignPointWithNoTailLineParamsType) {
  const assignableData = getAssignableFloorsWithNoTailLine({ sex, church });
  const seperatedData = separateAssignFloorsToFiveLinesAndOthers(assignableData as AssignableFloorIndexArrayType);
  const assignPoint = getAssignPoint(seperatedData);

  if (assignPoint) {
    return assignPoint;
  }

  return null;
}

//////////////////// 조합 차이값에 따른 배정 위치 조회
type GetAssignablePointByCombinationDifferenceParamsType = {
  sex: "male" | "female";
  church: ChurchType;
  difference: number;
};

function getAssignablePointByCombinationDifference({
  sex,
  church,
  difference,
}: GetAssignablePointByCombinationDifferenceParamsType) {
  const assignableData = getAssignableFloorsByCombinationDifference({ sex, church, difference });
  const seperatedData = separateAssignFloorsToFiveLinesAndOthers(assignableData as AssignableFloorIndexArrayType);
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

  const lineRemain = getLastAssignedRoomRemainAfter(sex, floorIndex, lineIndex);
  const lineNeed = lineRemain % maxRoomPeople;

  if (sex === "male") {
    if (!churchMaleArray || churchMaleArray.length === 0) {
      return null;
    }

    const filteredChurchs = churchMaleArray.filter((church) => {
      const churchMod = church.people % maxRoomPeople;
      return churchMod !== 0 && church.people > 0 && lineRemain > church.people && churchMod === lineNeed;
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
  sex: "male" | "female";
  church: ChurchType;
  floorIndex: number;
  lineIndex: number;
};

function checkLineAssign({ sex, church, floorIndex, lineIndex }: CheckLineAssignParamsType): {
  isAssignable: boolean;
  lineRemain: number;
} {
  const churchPeople = church.people;
  const lastAssignedRoomRemainAfter = getLastAssignedRoomRemainAfter(sex, floorIndex, lineIndex);

  if (churchPeople > lastAssignedRoomRemainAfter) {
    return { isAssignable: false, lineRemain: lastAssignedRoomRemainAfter };
  }

  return { isAssignable: true, lineRemain: lastAssignedRoomRemainAfter };

  /////////////////////////////////////
  // let lineRemain = 0;

  // line.rooms.forEach((room) => {
  //   lineRemain += room.remain;
  // });

  // if (lineRemain < church.people) {
  //   return { isAssignable: false, lineRemain: lineRemain };
  // }

  // return { isAssignable: true, lineRemain: lineRemain };
}

//////////////////// 배정 가능 층 조회

type GetAssignableInFloorParamsType = {
  sex: "male" | "female";
  church: ChurchType;
  floorIndex: number;
};

type LineInfoType = {
  lineIndex: number;
  lineRemain: number;
};

function getAssignableInFloor({ sex, church, floorIndex }: GetAssignableInFloorParamsType) {
  const currentDormitory = useDormitoryStore.getState().dormitoryData;
  const { lines } = currentDormitory?.[sex].floors[floorIndex] as FloorType;

  const assignableLineInfoArray: LineInfoType[] = [];

  lines.forEach((line, lineIndex) => {
    const { isAssignable, lineRemain } = checkLineAssign({ sex, church, floorIndex, lineIndex });

    if (isAssignable) {
      assignableLineInfoArray.push({ lineIndex: lineIndex, lineRemain: lineRemain });
    }
  });

  return assignableLineInfoArray;
}

//////////////////// 추천 배정 위치 조회

type GetRecommendedAssignmentPointParamsType = {
  sex: "male" | "female";
  church: ChurchType;
};

function getRecommendedAssignmentPoint({ sex, church }: GetRecommendedAssignmentPointParamsType) {
  const assignableFloorIndexArray = getAssignableInDormitory({ sex, church });

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
  sex: "male" | "female";
  church: ChurchType;
};

function getFitAssignPoint({ sex, church }: GetFitAssignPointParamsType) {
  // 방 최대 인원 가져오기
  const { maxRoomPeople } = useDormitoryStore.getState();
  // 교회의 나머지 인원
  const churchRemain = church.people % maxRoomPeople;

  // console.log(`${church.churchName} 모든 배정 가능 라인 \n ${JSON.stringify(assignableFloorIndexArray, null, 2)}`);

  // 모든 배정 가능 라인 조회
  const assignableFloorIndexArray = getAssignableInDormitory({ sex, church });

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
