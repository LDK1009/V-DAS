import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { RoomType } from "@/types/dormitory";
import React from "react";

const Room = ({ lineIndex, room, roomIndex }: { lineIndex: number; room: RoomType; roomIndex: number }) => {
  const { currentFloor } = useDormitoryStore();
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

  return (
    <div>
      <div>{`${currentFloor + 1}${String(roomNumber).padStart(2, "0")}호`}</div>
      <div>
        <div>최대 인원 : {room.max}</div>
        <div>현재 인원 : {room.current}</div>
        <div>남은 인원 : {room.remain}</div>
      </div>
      <div>
        <h5>참여 교회</h5>
        {room.assignedChurchArray.map((church, churchIndex) => {
          return (
            <div key={`${currentFloor}-${lineIndex}-${roomIndex}-${churchIndex}`}>
              {churchIndex + 1}. | {church.churchName} | {church.people}명
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Room;
