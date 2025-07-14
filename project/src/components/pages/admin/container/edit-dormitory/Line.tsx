import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { Stack, styled } from "@mui/material";
import React from "react";
import Room from "./Room";

const Line = ({ lineIndex }: { lineIndex: number }) => {
  const { dormitoryData, currentFloor } = useDormitoryStore();
  const anySexFloors = [...(dormitoryData?.male?.floors || []), ...(dormitoryData?.female?.floors || [])];
  const lineData = anySexFloors.filter((floor) => floor.floorNumber === currentFloor)[0]?.lines[lineIndex];

  if (!lineData) return null;

  return (
    <Container>
      {lineData.rooms.map((room, roomIndex) => {
        return (
          <Room
            lineIndex={lineIndex}
            room={room}
            roomIndex={roomIndex}
            key={`${currentFloor}-${lineIndex}-${roomIndex}`}
          />
        );
      })}
    </Container>
  );
};

export default Line;

const Container = styled(Stack)`
  width: 100%;
  height: 100%;
  row-gap: 10px;
`;
