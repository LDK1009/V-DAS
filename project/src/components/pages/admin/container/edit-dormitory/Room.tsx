import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { mixinFlex } from "@/styles/mixins";
import { RoomType } from "@/types/dormitory";
import { Stack, styled } from "@mui/material";
import React from "react";
import ChurchItem from "../church-list/ChurchItem";
import { shouldForwardProp } from "@/utils/mui";

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
  const { currentFloor } = useDormitoryStore();
  const { maxRoomPeople } = useDormitoryStore.getState();

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

  return (
    <Container>
      <RoomNumberContainer>{`${currentFloor + 1}${String(customRoomNumber || roomNumber).padStart(
        2,
        "0"
      )}`}</RoomNumberContainer>

      <ChurchContainer>
        {room.assignedChurchArray.map((church, churchIndex) => {
          return <ChurchItem church={church} key={`${currentFloor}-${lineIndex}-${roomNumber}-${churchIndex}`} />;
        })}
      </ChurchContainer>
      <RoomCurrentContainer $status={getRoomStatus(room.current)}>{room.current}</RoomCurrentContainer>
    </Container>
  );
};

export default Room;

const Container = styled(Stack)`
  ${mixinFlex("row", "start", "center")}
  width: 100%;
  height: 100%;
  border: 1px solid black;
  border-radius: 8px;
  overflow: hidden;
`;

const RoomNumberContainer = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  width: 40px;
  height: 55px;
  min-width: 40px;
  min-height: 55px;
  font-size: 14px;
`;

const ChurchContainer = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  min-width: 172px;
  height: 55px;
  border: 1px solid black;
  border-top: none;
  border-bottom: none;
  padding: 6px 4px;
  row-gap: 4px;
`;

type RoomCurrentContainerPropsType = {
  $status: "exceed" | "full" | "insufficient";
};
const RoomCurrentContainer = styled(RoomNumberContainer, { shouldForwardProp })<RoomCurrentContainerPropsType>`
  font-size: 16px;
  background-color: ${({ $status }) => {
    if ($status === "exceed") return "blue";
    if ($status === "full") return "transparent";
    if ($status === "insufficient") return "yellow";
  }};
`;
