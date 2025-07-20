import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { mixinMuiTextInputBorder } from "@/styles/mixins";
import {  styled, TextField } from "@mui/material";
import { useEffect } from "react";

const SettingMaxPeopleCount = () => {
  const { maxRoomPeople, setMaxRoomPeople, dormitoryData } = useDormitoryStore();

  useEffect(() => {
    console.log(dormitoryData);
    if (dormitoryData) {
      setMaxRoomPeople(maxRoomPeople);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dormitoryData]);

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
