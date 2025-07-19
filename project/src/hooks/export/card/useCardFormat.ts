import { useCurrentChurchStore } from "@/store/church/churchStore";
import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { ChurchType } from "@/types/currentChurchType";
import { getRoomNumber } from "@/utils/room/room";
import { useCallback } from "react";

export const useCardFormat = () => {
  const churchMaleArray = useCurrentChurchStore((state) => state.churchMaleArray);
  const churchFemaleArray = useCurrentChurchStore((state) => state.churchFemaleArray);
  const dormitoryData = useDormitoryStore((state) => state.dormitoryData);

  ////////////////////////////// 중복된 교회를 제거한 모든 교회 배열 가져오기
  const getUniqChurches = useCallback(() => {
    const uniqChurches = [...(churchMaleArray || []), ...(churchFemaleArray || [])]
      .filter((el, index, self) => index === self.findIndex((selfItem) => selfItem.churchName === el.churchName))
      .map((el) => el.churchName)
      .sort((a, b) => a.localeCompare(b));

    return uniqChurches;
  }, [churchMaleArray, churchFemaleArray]);

  ////////////////////////////// 방에 배정된 교회의 배정 정보 가져오기
  type GetChurchAssginInfoParamsType = {
    churchName: string;
    sex: "male" | "female";
    floorNumber: number;
    lineIndex: number;
    roomIndex: number;
  };

  type AssginInfoType = {
    floorNumber: number;
    roomNumber: number;
    churchAssignInfo: ChurchType;
  };

  const getChurchAssginInfo = ({
    churchName,
    sex,
    floorNumber,
    lineIndex,
    roomIndex,
  }: GetChurchAssginInfoParamsType): AssginInfoType | null => {
    const roomNumber = Number(getRoomNumber(floorNumber, lineIndex, roomIndex));
    const floor = dormitoryData?.[sex]?.floors.find((el) => el.floorNumber === floorNumber);
    const room = floor?.lines[lineIndex].rooms[roomIndex];

    const churchAssignInfo = room?.assignedChurchArray.find((el) => {
      return el.churchName === churchName;
    });

    if (!churchAssignInfo) {
      return null;
    }

    return {
      floorNumber,
      roomNumber,
      churchAssignInfo,
    };
  };

  ////////////////////////////// 남/녀 기숙사 내 모든 교회의 배정 정보 가져오기
  type GetAllChurchAssginInfoParamsType = {
    sex: "male" | "female";
    churchName: string;
  };

  type AllChurchAssginInfoType = {
    sex: "male" | "female";
    churchName: string;
    assignInfos: AssginInfoType[] | [];
  };

  const getAllChurchAssginInfo = ({ sex, churchName }: GetAllChurchAssginInfoParamsType): AllChurchAssginInfoType => {
    // 기숙사 데이터
    const dormitory = dormitoryData?.[sex];
    // 배정 정보 배열
    const churchAssginInfos: AssginInfoType[] = [];

    // 모든 방에 대해 반복
    dormitory?.floors.forEach((floor) => {
      floor.lines.forEach((line, lineIndex) => {
        line.rooms.forEach((room, roomIndex) => {
          const churchAssignInfo = getChurchAssginInfo({
            churchName,
            sex,
            floorNumber: floor.floorNumber,
            lineIndex,
            roomIndex,
          });

          if (churchAssignInfo) {
            churchAssginInfos.push(churchAssignInfo);
          }
        });
      });
    });

    // 방 번호 순으로 정렬
    const response = churchAssginInfos.sort((a, b) => a.roomNumber - b.roomNumber);

    return {
      sex,
      churchName,
      assignInfos: response,
    };
  };

  ////////////////////////////// 배정 정보 배열을 카드 데이터 형식으로 변환
  type FormatFromAssignInfosToTableRowParamsType = AllChurchAssginInfoType;

  type TableRowType = {
    sex: "male" | "female";
    assignedInfo: {
      totalAssignedCount: number;
      floorNumber: number;
      startAssignedInfo: {
        roomNumber: number;
        assignedCount: number;
      };
      endAssignedInfo: {
        roomNumber: number;
        assignedCount: number;
      };
    };
  } | null;

  const formatFromAssignInfosToTableRow = ({
    sex,
    assignInfos,
  }: FormatFromAssignInfosToTableRowParamsType): TableRowType => {
    if (assignInfos.length === 0) {
      return null;
    }

    const totalAssignedCount = assignInfos.reduce((acc, curr) => acc + curr.churchAssignInfo.people, 0);
    const startAssignedInfo = assignInfos[0];
    const endAssignedInfo = assignInfos.slice(-1)[0];

    return {
      sex,
      assignedInfo: {
        totalAssignedCount,
        floorNumber: startAssignedInfo.floorNumber,
        startAssignedInfo: {
          roomNumber: startAssignedInfo.roomNumber,
          assignedCount: startAssignedInfo.churchAssignInfo.people,
        },
        endAssignedInfo: {
          roomNumber: endAssignedInfo.roomNumber,
          assignedCount: endAssignedInfo.churchAssignInfo.people,
        },
      },
    };
  };

  ////////////////////////////// 교회의 카드 데이터 가져오기(성별, 배정인원, A/B, 배정호수 및 꼬리방 인원)
  type CardInfoType = {
    churchName: string;
    maleCardInfo: TableRowType | null;
    femaleCardInfo: TableRowType | null;
  };

  const getChurchCardData = useCallback(
    (churchName: string): CardInfoType => {
      console.log("시작");
      const churchAssginInfosInMaleDormitory = getAllChurchAssginInfo({ sex: "male", churchName });
      const churchAssginInfosInFemaleDormitory = getAllChurchAssginInfo({ sex: "female", churchName });

      const maleCardInfo: TableRowType = formatFromAssignInfosToTableRow({
        sex: "male",
        churchName,
        assignInfos: churchAssginInfosInMaleDormitory.assignInfos,
      });

      const femaleCardInfo: TableRowType = formatFromAssignInfosToTableRow({
        sex: "female",
        churchName,
        assignInfos: churchAssginInfosInFemaleDormitory.assignInfos,
      });

      return { churchName, maleCardInfo, femaleCardInfo };
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dormitoryData]
  );

  const getAllChurchCardData = useCallback(() => {
    const uniqChurches = getUniqChurches();
    const churchCardDatas: CardInfoType[] = [];

    uniqChurches.forEach((churchName) => {
      const churchCardInfo = getChurchCardData(churchName);
      churchCardDatas.push(churchCardInfo);
    });

    return churchCardDatas;
  }, [getUniqChurches, getChurchCardData]);

  return { getUniqChurches, getChurchCardData, getAllChurchCardData };
};
