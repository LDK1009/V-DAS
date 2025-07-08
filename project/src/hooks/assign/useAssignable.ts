import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { ChurchType } from "@/types/currentChurchType";
import { DormitoryType, FloorType, LineType } from "@/types/dormitory";

//////////////////////////////////////////////////////////////////////////////////////////////////// 라인 잔여 인원 조회

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

//////////////////////////////////////////////////////////////////////////////////////////////////// 라인 배정 가능 여부 조회

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

//////////////////////////////////////////////////////////////////////////////////////////////////// 배정 가능 층 조회

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

//////////////////////////////////////////////////////////////////////////////////////////////////// 기숙사 내 모든 배정 가능 라인 조회

type GetAssignableInDormitoryParamsType = {
  church: ChurchType;
};

type AssignableFloorIndexArrayType = { floorIndex: number; lineInfoArray: LineInfoType[] }[];

function getAssignableInDormitory({ church }: GetAssignableInDormitoryParamsType) {
  // 실시간 최신 상태 가져오기
  const currentDormitory = useDormitoryStore.getState().dormitoryData;
  const { maxRoomPeople } = useDormitoryStore.getState();

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

//////////////////////////////////////////////////////////////////////////////////////////////////// 기숙사 내 모든 배정 가능 중 나머지가 남지 않는 라인 조회
function getAssignableNoTailLine({ church }: GetAssignableInDormitoryParamsType) {
  const assignableFloors = getAssignableInDormitory({ church }) as AssignableFloorIndexArrayType;
  const { maxRoomPeople } = useDormitoryStore.getState();
  const churchPeople = church.people;
  const churchRemain = churchPeople % maxRoomPeople;

  const assignableNoTailFloors = assignableFloors
    .map((floorInfo) => {
      const lineInfos = floorInfo.lineInfoArray;
      const newLineInfos = lineInfos.filter((lineInfo) => {
        const { lineRemain } = lineInfo;
        const isCombination = lineRemain % maxRoomPeople === churchRemain;
        const isLineNoTail = lineRemain % maxRoomPeople === 0;

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

  return assignableNoTailFloors;
}

//////////////////////////////////////////////////////////////////////////////////////////////////// 추천 배정 위치 조회

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

//////////////////////////////////////////////////////////////////////////////////////////////////// 핏한 배정 위치 조회

type GetFitAssignPointParamsType = {
  church: ChurchType;
};

function getFitAssignPoint({ church }: GetFitAssignPointParamsType) {
  // 방 최대 인원 가져오기
  const { maxRoomPeople, dormitoryData } = useDormitoryStore.getState();
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

  /////////////////////////////////////////////////////////////////////
  // 핏한 라인만 추출
  const fitLineInfoArray = lineModArray
    .map((floorInfo) => {
      const floorIndex = floorInfo.floorIndex;
      // 빈방이거나 방의 수용 가능 인원이 교회의 나머지 인원과 같은 경우
      const newLineInfoArray = floorInfo.lineInfoArray.filter((lineInfo) => {
        const lineMod = lineInfo.lineMod;
        return lineMod >= churchRemain;
      });

      if (newLineInfoArray.length > 0) {
        return {
          floorIndex: floorIndex,
          lineInfoArray: newLineInfoArray,
        };
      }
    })
    .filter((floorInfo) => {
      return floorInfo !== undefined;
    });

  console.log(`${church.churchName} 나머지 인원 : ${churchRemain}`);
  console.log(`${church.churchName} 핏한 라인 \n ${JSON.stringify(fitLineInfoArray, null, 2)}`);

  // 핏한 배정 위치
  if (fitLineInfoArray.length > 0) {
    // const fitAssignPoint = {
    //   floorIndex: fitLineInfoArray[0].floorIndex,
    //   lineIndex: fitLineInfoArray[0].lineInfoArray[0].lineIndex,
    // };

    let fitAssignPoint;

    // 핏한 위치
    for (const floorInfo of fitLineInfoArray) {
      const { lineInfoArray } = floorInfo;
      for (const lineInfo of lineInfoArray) {
        const { lineMod } = lineInfo;
        if (lineMod === churchRemain) {
          return {
            isFit: true,
            floorIndex: floorInfo.floorIndex,
            lineIndex: lineInfo.lineIndex,
          };
        }
      }
    }

    // 핏하지 않지만 다음방이 있는 라인
    for (const floorInfo of fitLineInfoArray) {
      const { lineInfoArray } = floorInfo;
      for (const lineInfo of lineInfoArray) {
        const { lineMod } = lineInfo;
        if (lineMod > churchRemain) {
          return {
            floorIndex: floorInfo.floorIndex,
            lineIndex: lineInfo.lineIndex,
          };
        }
      }
    }
    // 나누어 떨어지는 라인
    for (const floorInfo of fitLineInfoArray) {
      const { lineInfoArray } = floorInfo;
      for (const lineInfo of lineInfoArray) {
        const { lineMod } = lineInfo;
        if (lineMod === 0) {
          return {
            floorIndex: floorInfo.floorIndex,
            lineIndex: lineInfo.lineIndex,
          };
        }
      }
    }

    console.log(`${church.churchName} 핏한 배정 위치 \n ${JSON.stringify(fitAssignPoint, null, 2)}`);

    return fitAssignPoint;
  }

  return null;
}

export {
  getLineRemain,
  checkLineAssign,
  getAssignableInFloor,
  getAssignableInDormitory,
  getAssignableNoTailLine,
  getRecommendedAssignmentPoint,
  getFitAssignPoint,
};
