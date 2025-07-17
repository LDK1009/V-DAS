import { mixinEllipsis, mixinFlex } from "@/styles/mixins";
import { ChurchType } from "@/types/currentChurchType";
import { keyframes, Stack, styled, Typography } from "@mui/material";
import { useDrag } from "react-dnd";
import React, { RefObject, useCallback } from "react";
import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { getCurrentFloorIndex, getCurrentFloorSex, getRoomInfo } from "@/hooks/assign/useAssignable";
import { enqueueSnackbar } from "notistack";
import { useCurrentChurchStore } from "@/store/church/churchStore";
import { shouldForwardProp } from "@/utils/mui";

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

  ////////// 라이프사이클

  ////////// 교회 인원 변경
  function handleChangeChurchPeople() {
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

  const isContainerDragging = useCallback(() => {
    if (type === "sidebar") {
      return isDraggingSidebar;
    }
    if (type === "room") {
      return isDraggingRoom;
    }
    return false;
  }, [type, isDraggingSidebar, isDraggingRoom]);

  return (
    <Container
      $isDragging={isContainerDragging()}
      ref={
        dragFrom === "sidebar"
          ? (fromSidebarDrag as unknown as RefObject<HTMLDivElement>)
          : (fromRoomDrag as unknown as RefObject<HTMLDivElement>)
      }
      onClick={type === "room" ? handleChangeChurchPeople : undefined}
    >
      <ChurchName>{church.churchName}</ChurchName>
      <ChurchPeople>{church.people}</ChurchPeople>
    </Container>
  );
};

export default ChurchItem;

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
  ${mixinFlex("row", "start", "center")}
  border-radius: 12px;
  border: 1px solid #000000;
  background-color: ${({ theme, $isDragging }) => ($isDragging ? theme.palette.primary.main : "transparent")};
  border: ${({ theme, $isDragging }) => $isDragging && `1px solid ${theme.palette.primary.main}`};
  animation: ${({ $isDragging }) => ($isDragging ? pulse : "none")} 1s ease-in-out infinite;

  &:hover{
    background-color: ${({theme}) => theme.palette.primary.main};
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

const ChurchPeople = styled(Typography)`
  width: 40px;
  height: 20px;
  ${mixinFlex("column", "center", "center")}

  border-left: 1px solid #000000;
  font-size: 16px;
  text-align: center;
`;
