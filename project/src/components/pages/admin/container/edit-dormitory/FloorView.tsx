import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { mixinFlex } from "@/styles/mixins";
import { LineType } from "@/types/dormitory";
import { Stack, styled } from "@mui/material";
import React from "react";

const FloorView = () => {
  const { dormitoryData, currentFloor } = useDormitoryStore();
  const lines: LineType[] = dormitoryData?.male?.floors[currentFloor]?.lines || [];

  return (
    <Container>
      {lines.map((line, lineIndex) => {
        let startRoomNumber: number;

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

        return (
          <LineContainer key={lineIndex}>
            <h1>{lineIndex + 1}번 라인</h1>
            {line.rooms.map((room, roomIndex) => {
              const roomNumber = startRoomNumber + roomIndex;

              return (
                <RoomContainer key={`${currentFloor}-${lineIndex}-${roomIndex}`}>
                  <div>{`${currentFloor + 1}${String(roomNumber).padStart(2, "0")}호`}</div>
                  <PeopleContainer>
                    <div>최대 인원 : {room.max}</div>
                    <div>현재 인원 : {room.current}</div>
                    <div>남은 인원 : {room.remain}</div>
                  </PeopleContainer>
                  <ChurchContainer>
                    <h5>참여 교회</h5>
                    {room.assignedChurchArray.map((church, churchIndex) => {
                      return (
                        <div key={`${currentFloor}-${lineIndex}-${roomIndex}-${churchIndex}`}>
                          {churchIndex + 1}. | {church.churchName} | {church.people}명
                        </div>
                      );
                    })}
                  </ChurchContainer>
                </RoomContainer>
              );
            })}
          </LineContainer>
        );
      })}
    </Container>
  );
};

export default FloorView;

const Container = styled(Stack)`
  ${mixinFlex("column", "flex-start", "flex-start")}
  width: 100%;
  height: 100%;
  row-gap: 20px;
  padding: 20px;
`;

const LineContainer = styled(Stack)`
  ${mixinFlex("column", "flex-start", "flex-start")}
  width: 100%;
  row-gap: 10px;
`;

const RoomContainer = styled(Stack)`
  ${mixinFlex("column", "flex-start", "flex-start")}
  width: 100%;
  row-gap: 10px;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.palette.primary.main};
  border-radius: 8px;
`;

const PeopleContainer = styled(Stack)`
  ${mixinFlex("column", "flex-start", "flex-start")}
  width: 100%;
  row-gap: 5px;
`;

const ChurchContainer = styled(Stack)`
  ${mixinFlex("column", "flex-start", "flex-start")}
  width: 100%;
  row-gap: 5px;
`;
