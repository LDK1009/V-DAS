import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { mixinFlex } from "@/styles/mixins";
import { RoomType } from "@/types/dormitory";
import { Stack, styled } from "@mui/material";
import React, { RefObject } from "react";
import ChurchItem from "../church-list/ChurchItem";
import { shouldForwardProp } from "@/utils/mui";
import { useDrop } from "react-dnd";
import { useCurrentChurchStore } from "@/store/church/churchStore";
import { useAssign } from "@/hooks/assign/useAssign";
import { ChurchType } from "@/types/currentChurchType";
import { enqueueSnackbar } from "notistack";
import { getCurrentFloorIndex, getRoomInfo, getUseFloors } from "@/hooks/assign/useAssignable";

const Room = ({
  lineIndex,
  room,
  roomIndex,
  customRoomNumber,
}: {
  lineIndex: number;
  room: RoomType;
  roomIndex: number;
  customRoomNumber?: number;
}) => {
  const { currentFloor, maxRoomPeople } = useDormitoryStore();
  const { currentChurchSex } = useCurrentChurchStore();
  const { assignRoom } = useAssign();

  let startRoomNumber = 1; // 기본값 설정
  // 라인별 방 번호 시작 번호
  if (lineIndex === 0) {
    startRoomNumber = 1;
  } else if (lineIndex === 1) {
    startRoomNumber = 7;
  } else if (lineIndex === 2) {
    startRoomNumber = 11;
  } else if (lineIndex === 3) {
    startRoomNumber = 16;
  } else if (lineIndex === 4) {
    startRoomNumber = 22;
  }

  const roomNumber = startRoomNumber + roomIndex;

  function getRoomStatus(current: number) {
    if (current > maxRoomPeople) return "exceed";
    if (current === maxRoomPeople) return "full";
    if (current < maxRoomPeople) return "insufficient";
    return "insufficient";
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "ITEM", // 받아들일 수 있는 드래그 아이템의 타입
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    drop: (church: { church: ChurchType; dragFrom: "room" | "sidebar" }, monitor) => {
      if (church.dragFrom === "room") {
        return;
      }

      // 사용 가능한 층 배열
      const useableFloors = getUseFloors(currentChurchSex);
      // 현재 층의 층 인덱스
      const currentFloorIndex = getCurrentFloorIndex(currentChurchSex);

      // 현재 층 인덱스 예외 처리
      if (currentFloorIndex !== 0 && !currentFloorIndex) {
        enqueueSnackbar("층 정보를 가져오는데 실패했습니다.", { variant: "error" });
        return;
      }

      // 성별 예외 처리
      if (useableFloors && !useableFloors.includes(currentFloor)) {
        enqueueSnackbar("다른 성별 층에는 배정할 수 없습니다.", { variant: "error" });
        return;
      }

      // 특정 방의 정보 가져오기
      const roomInfo = getRoomInfo(currentChurchSex, currentFloorIndex, lineIndex, roomIndex);

      if (church.people <= 0) {
        enqueueSnackbar("교회 인원이 0명 이하입니다.", { variant: "error" });
        return;
      }

      // 방이 꽉 차있을 경우
      if (roomInfo.remain <= 0) {
        const inputNumber = prompt("배정 인원을 입력해주세요.");

        // 양의 정수 패턴
        const integerPattern = /^[1-9]\d*$/;

        // 입력값이 없을 경우
        if (!inputNumber) {
          return;
        }

        // 양의 정수 패턴 예외 처리
        if (!integerPattern.test(inputNumber)) {
          enqueueSnackbar("배정 인원을 입력해주세요.", { variant: "error" });
          return;
        }

        // 방 배정
        assignRoom({
          sex: currentChurchSex,
          church: church,
          count: Number(inputNumber),
          floorIndex: currentFloorIndex,
          lineIndex,
          roomIndex,
        });

        return;
      }

      // 방이 꽉 차지 않았을 경우
      if (roomInfo.remain > 0) {
        // 교회 인원이 방 인원보다 많을 경우
        if (church.people > roomInfo.remain) {
          assignRoom({
            sex: currentChurchSex,
            church: church,
            count: roomInfo.remain,
            floorIndex: currentFloorIndex,
            lineIndex,
            roomIndex,
          });
          return;
        }
        // 교회 인원이 방 인원보다 적을 경우
        if (church.people < roomInfo.remain) {
          assignRoom({
            sex: currentChurchSex,
            church: church,
            count: church.people,
            floorIndex: currentFloorIndex,
            lineIndex,
            roomIndex,
          });
          return;
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <Container ref={drop as unknown as RefObject<HTMLDivElement>}>
      <RoomNumberContainer>{`${currentFloor}${String(customRoomNumber || roomNumber).padStart(
        2,
        "0"
      )}`}</RoomNumberContainer>

      <ChurchContainer>
        {room.assignedChurchArray.map((church, churchIndex) => {
          return (
            <ChurchItem
              church={church}
              key={`${currentFloor}-${lineIndex}-${roomNumber}-${churchIndex}`}
              dragFrom="room"
            />
          );
        })}
      </ChurchContainer>
      <RoomCurrentContainer $status={getRoomStatus(room.current)}>{room.current}</RoomCurrentContainer>
    </Container>
  );
};

export default Room;

const Container = styled(Stack)`
  ${mixinFlex("row", "start", "stretch")}
  width: 100%;
  height: 100%;
  border: 1px solid black;
  border-radius: 8px;
  overflow: hidden;
`;

const RoomNumberContainer = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  width: 40px;
  min-width: 40px;
  height: 100%;
  min-height: 55px;
  font-size: 14px;
`;

const ChurchContainer = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  width: 172px;
  min-width: 172px;
  height: 100%;
  min-height: 55px;
  border: 1px solid black;
  border-top: none;
  border-bottom: none;
  padding: 6px 4px;
  row-gap: 4px;
`;

type RoomCurrentContainerPropsType = {
  $status: "exceed" | "full" | "insufficient";
};
const RoomCurrentContainer = styled(Stack, { shouldForwardProp })<RoomCurrentContainerPropsType>`
  ${mixinFlex("column", "center", "center")}
  width: 40px;
  min-width: 40px;
  font-size: 16px;
  background-color: ${({ $status }) => {
    if ($status === "exceed") return "blue";
    if ($status === "full") return "transparent";
    if ($status === "insufficient") return "yellow";
  }};
`;
