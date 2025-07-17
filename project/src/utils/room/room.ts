function getRoomNumber(floorNumber: number, lineIndex: number, roomIndex: number) {
  let startRoomNumber = 1;

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

  return `${floorNumber}${String(startRoomNumber + roomIndex).padStart(2, "0")}`;
}

export { getRoomNumber };
