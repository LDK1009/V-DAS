import { useCurrentChurchStore } from "@/store/church/churchStore";
import { mixinFlex } from "@/styles/mixins";
import { Button, Stack, styled } from "@mui/material";
import { shouldForwardProp } from "@/utils/mui";

const ChurchListHeader = () => {
  const { currentChurchSex, setCurrentChurchSex } = useCurrentChurchStore();
  return (
    <Container>
      <SelectButtonGroup>
        <SelectMaleButton $isSelected={currentChurchSex === "male"} onClick={() => setCurrentChurchSex("male")}>
          남자
        </SelectMaleButton>
        <SelectFemaleButton $isSelected={currentChurchSex === "female"} onClick={() => setCurrentChurchSex("female")}>
          여자
        </SelectFemaleButton>
      </SelectButtonGroup>
      <h4>검색바 들어올 예정</h4>
    </Container>
  );
};

export default ChurchListHeader;

const Container = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  width: 100%;
  height: 85px;
  border-bottom: 1px solid black;
`;

const SelectButtonGroup = styled(Stack)`
  ${mixinFlex("row", "center", "center")}
  column-gap: 8px;
  width: 100%;
`;

type SelectButtonPropsType = {
  $isSelected: boolean;
};

const SelectMaleButton = styled(Button, { shouldForwardProp })<SelectButtonPropsType>`
  background-color: ${({ $isSelected }) => ($isSelected ? "#6495ED" : "white")};
  color: ${({ theme, $isSelected }) => ($isSelected ? theme.palette.text.white : "#6495ED")};
  border: 1px solid #6495ed;
`;

const SelectFemaleButton = styled(Button, { shouldForwardProp })<SelectButtonPropsType>`
  background-color: ${({ $isSelected }) => ($isSelected ? "#ff66b2" : "white")};
  color: ${({ theme, $isSelected }) => ($isSelected ? theme.palette.text.white : "#ff66b2")};
  border: 1px solid #ff66b2;
`;
