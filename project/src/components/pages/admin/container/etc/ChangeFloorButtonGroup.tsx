import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { mixinFlex } from "@/styles/mixins";
import { Button, Stack, styled } from "@mui/material";
import { shouldForwardProp } from "@/utils/mui";

const ChangeFloorButtonGroup = () => {
  const { dormitoryData, currentFloor, setCurrentFloor } = useDormitoryStore();

  const maleUseFloorNumbers = [...(dormitoryData?.male?.useFloorNumbers || [])].sort((a, b) => a - b);
  const femaleUseFloorNumbers = [...(dormitoryData?.female?.useFloorNumbers || [])].sort((a, b) => a - b);

  return (
    <Container>
      <ButtonGroup>
        <MaleButtonGroup>
          {maleUseFloorNumbers.map((floorNumber) => (
            <MaleFloorButton
              key={floorNumber}
              $isSelected={currentFloor === floorNumber}
              variant={currentFloor === floorNumber ? "contained" : "outlined"}
              onClick={() => setCurrentFloor(floorNumber)}
            >
              {floorNumber}
            </MaleFloorButton>
          ))}
        </MaleButtonGroup>
        <FemaleButtonGroup>
          {femaleUseFloorNumbers.map((floorNumber) => (
            <FemaleFloorButton
              key={floorNumber}
              $isSelected={currentFloor === floorNumber}
              variant={currentFloor === floorNumber ? "contained" : "outlined"}
              onClick={() => setCurrentFloor(floorNumber)}
            >
              {floorNumber}
            </FemaleFloorButton>
          ))}
        </FemaleButtonGroup>

        {/* {useFloorNumbers.map((floorNumber) => (
          <FloorButton
            key={floorNumber}
            variant={currentFloor === floorNumber ? "contained" : "outlined"}
            onClick={() => setCurrentFloor(floorNumber)}
          >
            {floorNumber}
          </FloorButton>
        ))} */}
      </ButtonGroup>
    </Container>
  );
};

export default ChangeFloorButtonGroup;

const Container = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  position: absolute;
  bottom: 0;
  right: 0;
  row-gap: 10px;
  padding: 20px;
`;

const ButtonGroup = styled(Stack)`
  ${mixinFlex("column", "center", "start")}
  gap: 8px;
  flex-wrap: wrap;
`;

type FloorButtonPropsType = {
  $isSelected: boolean;
};

const FloorButton = styled(Button, { shouldForwardProp })<FloorButtonPropsType>`
  min-width: 40px;
  height: 40px;
  padding: 0;
`;

const MaleButtonGroup = styled(Stack)`
  ${mixinFlex("row", "center", "center")}
  gap: 8px;
`;

const FemaleButtonGroup = styled(MaleButtonGroup)``;

const MaleFloorButton = styled(FloorButton, { shouldForwardProp })<FloorButtonPropsType>`
  background-color: ${({ theme, $isSelected }) => ($isSelected ? theme.palette.primary.main : "#6495ED")};
  color: ${({ theme }) => theme.palette.text.white};
`;

const FemaleFloorButton = styled(MaleFloorButton, { shouldForwardProp })<FloorButtonPropsType>`
  background-color: ${({ theme, $isSelected }) => ($isSelected ? theme.palette.primary.main : "#ff66b2")};
`;
