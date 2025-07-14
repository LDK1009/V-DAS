import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { mixinFlex } from "@/styles/mixins";
import { Box, Button, Stack, styled } from "@mui/material";
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
            <MaleButtonBorder key={floorNumber} $isSelected={currentFloor === floorNumber}>
              <MaleFloorButton
                key={floorNumber}
                $isSelected={currentFloor === floorNumber}
                onClick={() => setCurrentFloor(floorNumber)}
              >
                {floorNumber}
              </MaleFloorButton>
            </MaleButtonBorder>
          ))}
        </MaleButtonGroup>
        <FemaleButtonGroup>
          {femaleUseFloorNumbers.map((floorNumber) => (
            <FemaleButtonBorder key={floorNumber} $isSelected={currentFloor === floorNumber}>
              <FemaleFloorButton
                key={floorNumber}
                $isSelected={currentFloor === floorNumber}
                onClick={() => setCurrentFloor(floorNumber)}
              >
                {floorNumber}
              </FemaleFloorButton>
            </FemaleButtonBorder>
          ))}
        </FemaleButtonGroup>
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
`;

const FemaleButtonGroup = styled(MaleButtonGroup)``;

const MaleFloorButton = styled(FloorButton, { shouldForwardProp })<FloorButtonPropsType>`
  background-color: #6495ed;
  color: ${({ theme }) => theme.palette.text.white};
`;

const FemaleFloorButton = styled(MaleFloorButton, { shouldForwardProp })<FloorButtonPropsType>`
  background-color: #ff66b2;
`;

const MaleButtonBorder = styled(Box, { shouldForwardProp })<FloorButtonPropsType>`
  padding: 4px;
  border: 1px solid ${({ $isSelected }) => ($isSelected ? "#6495ED" : "transparent")};
  border-radius: 8px;
`;

const FemaleButtonBorder = styled(MaleButtonBorder)`
  border: 1px solid ${({ $isSelected }) => ($isSelected ? "#ff66b2" : "transparent")};
`;
