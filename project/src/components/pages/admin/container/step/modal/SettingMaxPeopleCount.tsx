import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { mixinFlex, mixinMuiTextInputBorder } from "@/styles/mixins";
import { Stack, styled, TextField } from "@mui/material";

const SettingMaxPeopleCount = () => {
  const { maxRoomPeople, setMaxRoomPeople } = useDormitoryStore();

  return (
    <Container>
      <Input type="number" value={maxRoomPeople} onChange={(e) => setMaxRoomPeople(Number(e.target.value))} />
    </Container>
  );
};

export default SettingMaxPeopleCount;

const Container = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  width: 100%;
  padding: 0px 16px;
`;
const Input = styled(TextField)`
  width: 100%;
  ${({ theme }) => mixinMuiTextInputBorder(theme)}

  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`;
