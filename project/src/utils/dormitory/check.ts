function checkFloorIndex(floorIndex: number) {
  if (floorIndex && !(floorIndex >= 0)) {
    return false;
  }
  return true;
}

export { checkFloorIndex };