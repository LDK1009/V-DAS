import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { mixinMuiTextInputBorder } from "@/styles/mixins";
import {  styled, TextField } from "@mui/material";

const SettingMaxPeopleCount = () => {
  const { maxRoomPeople, setMaxRoomPeople } = useDormitoryStore();

  return (
    <>
      <Input type="number" value={maxRoomPeople} onChange={(e) => setMaxRoomPeople(Number(e.target.value))} />
    </>
  );
};

export default SettingMaxPeopleCount;

const Input = styled(TextField)`
  width: 100%;
  ${({ theme }) => mixinMuiTextInputBorder(theme)}

  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`;
