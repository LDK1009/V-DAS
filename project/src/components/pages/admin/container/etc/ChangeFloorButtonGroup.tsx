import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { mixinFlex } from "@/styles/mixins";
import { Button, Stack, styled } from "@mui/material";
import React from "react";

const ChangeFloorButtonGroup = () => {
  const { dormitoryData, currentFloor, setCurrentFloor, maxFloor } = useDormitoryStore();
  const floors = dormitoryData?.male?.floors;

  if (!floors) return null;

  return (
    <Container>
      <ButtonGroup>
        {floors.slice(0, maxFloor).map((el) => (
          <FloorButton
            key={el.floorNumber}
            variant={currentFloor === el.floorNumber ? "contained" : "outlined"}
            onClick={() => setCurrentFloor(el.floorNumber)}
          >
            {el.floorNumber + 1}
          </FloorButton>
        ))}
      </ButtonGroup>
      <CurrentFloor>현재 층 : {currentFloor + 1}</CurrentFloor>
    </Container>
  );
};

export default ChangeFloorButtonGroup;

const Container = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  width: 100%;
  row-gap: 10px;
  padding: 20px;
`;

const ButtonGroup = styled(Stack)`
  ${mixinFlex("row", "center", "center")}
  gap: 8px;
  flex-wrap: wrap;
`;

const FloorButton = styled(Button)`
  min-width: 40px;
  height: 40px;
  padding: 0;
`;

const CurrentFloor = styled("div")`
  font-size: 16px;
  font-weight: 600;
`;
