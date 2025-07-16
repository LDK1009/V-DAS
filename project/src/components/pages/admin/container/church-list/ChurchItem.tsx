import { mixinEllipsis, mixinFlex } from "@/styles/mixins";
import { ChurchType } from "@/types/currentChurchType";
import { Stack, styled, Typography } from "@mui/material";
import { useDrag } from "react-dnd";
import React, { RefObject, useEffect } from "react";
import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { getCurrentFloorIndex, getCurrentFloorSex } from "@/hooks/assign/useAssignable";
import { useCurrentChurchStore } from "@/store/church/churchStore";
import { enqueueSnackbar } from "notistack";

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
  const [{ isDragging: isDraggingSidebar }, fromSidebarDrag] = useDrag(
    () => ({
      type: "ITEM",
      item: { ...church, dragFrom: "sidebar" },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [church]
  );

  const [{ isDragging: isDraggingRoom }, fromRoomDrag] = useDrag(
    () => ({
      type: "ITEM",
      item: { ...church, dragFrom: "room" },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [church]
  );

  useEffect(() => {
    console.log(`사이드바에서 드래그 시작 ${isDraggingSidebar}`);
  }, [isDraggingSidebar]);

  useEffect(() => {
    console.log(`방에서 드래그 시작 ${isDraggingRoom}`);
  }, [isDraggingRoom]);

  function handleChangeChurchPeople() {
    const { updateRoomCurrentAndRemain } = useDormitoryStore.getState();

    const evacuateCount = prompt("방출 인원을 입력해주세요.");

    // 양의 정수 패턴
    const integerPattern = /^[1-9]\d*$/;

    // 입력값이 없을 경우
    if (!evacuateCount) {
      return;
    }

    // 양의 정수 패턴 예외 처리
    if (!integerPattern.test(evacuateCount)) {
      enqueueSnackbar("양의 정수를 입력해주세요.", { variant: "error" });
      return;
    }

    alert(evacuateCount);

    // 현재 층
    const { currentFloor } = useDormitoryStore.getState();

    // 현재 층의 성별
    const currentFloorSex = getCurrentFloorSex();

    if (!currentFloorSex) return;

    // 현재 층 인덱스
    const floorIndex = getCurrentFloorIndex(currentFloorSex);

    if (floorIndex && !(floorIndex >= 0)) return;
    if (lineIndex && !(lineIndex >= 0)) return;
    if (roomIndex && !(roomIndex >= 0)) return;

    updateRoomCurrentAndRemain({
      sex: currentFloorSex,
      church,
      count: -Number(evacuateCount),
      floorIndex: floorIndex as number,
      lineIndex: lineIndex as number,
      roomIndex: roomIndex as number,
    });

    alert("성공");

    console.log(-Number(evacuateCount));
    console.log("현재 층", currentFloor);
    console.log("현재 층 성별", currentFloorSex);
  }

  return (
    <Container
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

const Container = styled(Stack)`
  width: 164px;
  ${mixinFlex("row", "start", "center")}
  border-radius: 12px;
  border: 1px solid #000000;
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
