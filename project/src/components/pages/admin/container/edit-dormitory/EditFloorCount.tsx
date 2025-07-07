import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { FloorType } from "@/types/dormitory";
import { Slider, styled } from "@mui/material";
import React from "react";

const EditFloorCount = () => {
  const { maxFloor, setMaxFloor, dormitoryData, setDormitoryData } = useDormitoryStore();

  function changeDormitoryFloor(floorCount: number) {
    setMaxFloor(floorCount);
    const sampleFloor = dormitoryData?.floors[0] as FloorType;

    const newDormitory = Array.from({ length: floorCount }, (_, index) => ({ ...sampleFloor, floorNumber: index }));
    setDormitoryData({ ...dormitoryData, floors: newDormitory });
  }

  return (
    <div>
      <h5>층 수 설정</h5>
      <StyeSlider
        value={maxFloor}
        valueLabelDisplay="auto"
        shiftStep={1}
        step={1}
        marks
        min={1}
        max={9}
        onChange={(e, value) => changeDormitoryFloor(value as number)}
      />
    </div>
  );
};

export default EditFloorCount;

const StyeSlider = styled(Slider)`
  width: 300px;
`;
