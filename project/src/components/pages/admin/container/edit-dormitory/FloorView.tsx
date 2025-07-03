import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { mixinFlex } from "@/styles/mixins";
import { LineType } from "@/types/dormitory";
import { Stack, styled } from "@mui/material";
import React from "react";

const FloorView = () => {
  const { dormitoryData, currentFloor } = useDormitoryStore();
  const lines: LineType[] = dormitoryData?.floors[currentFloor].lines || [];

  return (
    <Container>
      {lines.map((line, lineIndex) => {
        return (
          <LineContainer key={lineIndex}>
            <h1>{lineIndex + 1}번 라인</h1>
            {line.rooms.map((room, roomIndex) => {
              return (
                <RoomContainer key={roomIndex}>
                  <div>최대 인원 : {room.max}</div>
                  <div>현재 인원 : {room.current}</div>
                  <div>남은 인원 : {room.remain}</div>
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
  ${mixinFlex("row", "center", "start")}
  column-gap: 16px;
`;

const LineContainer = styled(Stack)`
  ${mixinFlex("column", "center", "start")}
  padding: 16px;
  border: 1px solid black;
  border-radius: 16px;
  row-gap: 16px;
`;

const RoomContainer = styled(Stack)`
  ${mixinFlex("row", "center", "center")}
  padding: 16px;
  border: 1px solid black;
  border-radius: 16px;
  gap: 8px;
`;
