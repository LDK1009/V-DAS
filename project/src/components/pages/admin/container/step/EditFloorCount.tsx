import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { FloorType } from "@/types/dormitory";
import { Slider, styled } from "@mui/material";
import React from "react";

const EditFloorCount = () => {
  const { maxFloor, setMaxFloor, dormitoryData, setDormitoryData } = useDormitoryStore();

  function changeDormitoryFloor(floorCount: number) {
    setMaxFloor(floorCount);
    const sampleFloor = dormitoryData?.male.floors[0] as FloorType;

    const newDormitory = Array.from({ length: floorCount }, (_, index) => ({ ...sampleFloor, floorNumber: index }));
    const useFloorNumbers = Array.from({ length: floorCount }, (_, i) => i);
    setDormitoryData({ 
      ...dormitoryData, 
      male: { ...dormitoryData?.male, sex: "male", useFloorNumbers, floors: newDormitory },
      female: { ...dormitoryData?.female, sex: "female", useFloorNumbers, floors: newDormitory }
    });
  }

  return (
    <div>
      <h5>사용하는 층 개수 : {maxFloor}</h5>
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
