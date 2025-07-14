import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { Stack, styled } from "@mui/material";
import React from "react";
import Room from "./Room";

const LineColumn4 = () => {
  const { dormitoryData, currentFloor } = useDormitoryStore();

  const anySexFloors = [...(dormitoryData?.male?.floors || []), ...(dormitoryData?.female?.floors || [])];
  const floors = anySexFloors.filter((floor) => floor.floorNumber === currentFloor)[0];

  const splitPoint = 11;
  const lineData4_1 = floors?.lines[4]?.rooms.slice(0, splitPoint);
  const lineData4_2 = floors?.lines[4]?.rooms.slice(splitPoint);

  if (!lineData4_1 || !lineData4_2) return null;

  return (
    <>
      <Container>
        <LineContainer>
          {lineData4_1.map((room, roomIndex) => {
            return <Room lineIndex={4} room={room} roomIndex={roomIndex} key={`${currentFloor}-${4}-${roomIndex}`} />;
          })}
        </LineContainer>
      </Container>
      <Container>
        <LineContainer>
          {lineData4_2.map((room, roomIndex) => {
            const roomNumber = 33 + roomIndex;
            return (
              <Room
                lineIndex={4}
                room={room}
                roomIndex={roomIndex}
                customRoomNumber={roomNumber}
                key={`${currentFloor}-${4}-${roomNumber}`}
              />
            );
          })}
        </LineContainer>
      </Container>
    </>
  );
};

export default LineColumn4;

const Container = styled(Stack)`
  padding: 12px 8px;
`;

const LineContainer = styled(Stack)`
  width: 100%;
  row-gap: 10px;
`;
