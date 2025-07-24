import { mixinEllipsis, mixinFlex } from "@/styles/mixins";
import { ChurchType } from "@/types/currentChurchType";
import { Box, keyframes, Stack, styled, Typography } from "@mui/material";
import { useDrag } from "react-dnd";
import React, { RefObject, useCallback, useState } from "react";
import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import {
  getChurchAssignedPosition,
  getCurrentFloorIndex,
  getCurrentFloorSex,
  getRoomInfo,
} from "@/hooks/assign/useAssignable";
import { enqueueSnackbar } from "notistack";
import { useCurrentChurchStore } from "@/store/church/churchStore";
import { shouldForwardProp } from "@/utils/mui";
import { getRoomNumber } from "@/utils/room/room";

const ChurchItem = ({
  lineIndex,
  roomIndex,
  type,
  dragFrom,
  church,
}: {
  lineIndex?: number;
  roomIndex?: number;
  type: "sidebar" | "room";
  dragFrom: "sidebar" | "room";
  church: ChurchType;
}) => {
  ////////// 사이드바에서 드래그 시작
  const [{ isDragging: isDraggingSidebar }, fromSidebarDrag] = useDrag(
    () => ({
      type: "ITEM",
      item: { church: church, dragFrom: "sidebar" },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [church]
  );

  ////////// 방에서 드래그 시작
  const [{ isDragging: isDraggingRoom }, fromRoomDrag] = useDrag(
    () => ({
      type: "ITEM",
      item: { church: church, lineIndex, roomIndex, dragFrom: "room" },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [church]
  );

  ////////// 교회 인원 변경(방)
  function handleChangeChurchPeopleInRoom() {
    const { updateRoomCurrentAndRemain } = useDormitoryStore.getState();
    const { evacuateChurchMale, evacuateChurchFemale } = useCurrentChurchStore.getState();

    const inputCount = prompt("변경할 인원을 입력해주세요.");

    // 양의 정수 패턴
    const integerPattern = /^[0-9]\d*$/;

    // 입력값이 없을 경우
    if (!inputCount) {
      return;
    }

    // 양의 정수 패턴 예외 처리
    if (!integerPattern.test(inputCount)) {
      enqueueSnackbar("0 이상의 정수를 입력해주세요.", { variant: "error" });
      return;
    }

    // 현재 층의 성별
    const currentFloorSex = getCurrentFloorSex();

    if (!currentFloorSex) return;

    // 현재 층 인덱스
    const floorIndex = getCurrentFloorIndex(currentFloorSex);

    if (floorIndex && !(floorIndex >= 0)) return;
    if (lineIndex && !(lineIndex >= 0)) return;
    if (roomIndex && !(roomIndex >= 0)) return;

    const evacuateCount = Number(inputCount);
    const roomInfo = getRoomInfo(currentFloorSex, floorIndex as number, lineIndex as number, roomIndex as number);
    const currentChurchAssignInfo = roomInfo.assignedChurchArray.find((x) => x.churchName === church.churchName);

    if (!currentChurchAssignInfo) return;

    const updateCount = -(currentChurchAssignInfo.people - evacuateCount);

    updateRoomCurrentAndRemain({
      sex: currentFloorSex,
      church,
      count: updateCount,
      floorIndex: floorIndex as number,
      lineIndex: lineIndex as number,
      roomIndex: roomIndex as number,
    });

    // 교회 인원 변경
    if (currentFloorSex === "male") {
      evacuateChurchMale(church.churchName, updateCount);
    } else if (currentFloorSex === "female") {
      evacuateChurchFemale(church.churchName, updateCount);
    }
  }

  ////////// 교회 인원 변경(사이드바)
  function handleChangeChurchPeopleInSidebar() {
    ///// 데이터 가져오기
    const { churchMaleArray, churchFemaleArray, currentChurchSex, evacuateChurchMale, evacuateChurchFemale } =
      useCurrentChurchStore.getState();
    const currentChurches = currentChurchSex === "male" ? churchMaleArray : churchFemaleArray;
    const targetChurch = currentChurches?.find((el) => el.churchName === church.churchName);
    const targetChurchCurrentPeople = targetChurch?.people;
    /////

    ///// 변경할 인원 입력 받기
    const inputCount = prompt("변경할 인원을 입력해주세요.");

    // 양의 정수 패턴
    const integerPattern = /^[0-9]\d*$/;

    // 입력값이 없을 경우
    if (!inputCount) {
      return;
    }

    // 양의 정수 패턴 예외 처리
    if (!integerPattern.test(inputCount)) {
      enqueueSnackbar("0 이상의 정수를 입력해주세요.", { variant: "error" });
      return;
    }
    /////

    ///// 교회 인원 변경
    if (targetChurchCurrentPeople !== 0 && !targetChurchCurrentPeople) return;

    const updateCount = targetChurchCurrentPeople - Number(inputCount);

    if (currentChurchSex === "male") {
      evacuateChurchMale(church.churchName, updateCount);
    } else if (currentChurchSex === "female") {
      evacuateChurchFemale(church.churchName, updateCount);
    }
  }

  const isContainerDragging = useCallback(() => {
    if (type === "sidebar") {
      return isDraggingSidebar;
    }
    if (type === "room") {
      return isDraggingRoom;
    }
    return false;
  }, [type, isDraggingSidebar, isDraggingRoom]);

  ////////// 교회 배정 위치
  const { currentChurchSex } = useCurrentChurchStore();
  const { setCurrentFloor } = useDormitoryStore();
  const churchAssignedPosition = getChurchAssignedPosition(currentChurchSex, church.churchName);
  const assginedPosition = [
    churchAssignedPosition?.floorIndex,
    (churchAssignedPosition?.lineIndex as number) + 1,
    getRoomNumber(
      churchAssignedPosition?.floorIndex as number,
      churchAssignedPosition?.lineIndex as number,
      churchAssignedPosition?.roomIndex as number
    ),
  ];
  const [isHover, setIsHover] = useState(false);

  return (
    <AssignedPositionWrapper
      onMouseEnter={() => {
        if (type === "sidebar") {
          setIsHover(true);
        }
      }}
      onMouseLeave={() => {
        if (type === "sidebar") {
          setIsHover(false);
        }
      }}
    >
      <Container
        ref={
          dragFrom === "sidebar"
            ? (fromSidebarDrag as unknown as RefObject<HTMLDivElement>)
            : (fromRoomDrag as unknown as RefObject<HTMLDivElement>)
        }
        onClick={type === "room" ? handleChangeChurchPeopleInRoom : handleChangeChurchPeopleInSidebar}
        $isDragging={isContainerDragging()}
      >
        <ChurchName>{church.churchName}</ChurchName>
        <ChurchPeople $isRemain={type === "sidebar" && church.people > 0}>{church.people}</ChurchPeople>
      </Container>
      {Number(assginedPosition[2]) >= 0 && (
        <AssignedPosition
          $isHover={isDraggingSidebar ? false : isHover}
          onClick={() => {
            setCurrentFloor(assginedPosition[0] as number);
          }}
        >{`${assginedPosition[2]}호`}</AssignedPosition>
      )}
    </AssignedPositionWrapper>
  );
};

export default ChurchItem;

const AssignedPositionWrapper = styled(Box)`
  position: relative;
`;

type ContainerPropsType = {
  $isDragging: boolean;
};

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
`;

const Container = styled(Stack, { shouldForwardProp })<ContainerPropsType>`
  width: 164px;
  height: 20px;
  min-height: 20px;

  ${mixinFlex("row", "start", "center")}
  border-radius: 12px;
  border: 1px solid #000000;
  background-color: ${({ theme, $isDragging }) => ($isDragging ? theme.palette.primary.main : "transparent")};
  border: ${({ theme, $isDragging }) => $isDragging && `1px solid ${theme.palette.primary.main}`};
  animation: ${({ $isDragging }) => ($isDragging ? pulse : "none")} 1s ease-in-out infinite;
  overflow: hidden;
  z-index: 2;

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary.main};
    cursor: pointer;
  }
`;

const ChurchName = styled(Typography)`
  margin-left: 12px;
  font-size: 12px;
  height: 20px;
  flex: 1;
  ${mixinEllipsis()};
`;

type ChurchPeoplePropsType = {
  $isRemain: boolean;
};

const ChurchPeople = styled(Typography, { shouldForwardProp })<ChurchPeoplePropsType>`
  width: 40px;
  height: 20px;
  ${mixinFlex("column", "center", "center")}

  border-left: 1px solid #000000;
  font-size: 16px;
  text-align: center;
  background-color: ${({ $isRemain }) => ($isRemain ? "yellow" : "transparent")};
`;

type AssignedPositionPropsType = {
  $isHover: boolean;
};

const AssignedPosition = styled(Box, { shouldForwardProp })<AssignedPositionPropsType>`
  position: absolute;
  bottom: 0px;
  left: calc(100% + 4px);
  width: 40px;
  height: 20px;
  padding: 4px;
  ${mixinFlex("column", "center", "center")}
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  opacity: ${({ $isHover }) => ($isHover ? 1 : 0)};
  z-index: 1;
`;
