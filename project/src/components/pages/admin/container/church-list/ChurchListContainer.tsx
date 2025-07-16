import { useCurrentChurchStore } from "@/store/church/churchStore";
import React, { useEffect } from "react";
import ChurchItem from "./ChurchItem";
import { Stack, styled } from "@mui/material";
import { mixinFlex, mixinHideScrollbar } from "@/styles/mixins";
import SelectSexButtonGroup from "./SelectSexButtonGroup";

const ChurchListContainer = () => {
  const {
    churchMaleArray,
    churchFemaleArray,
    currentChurchSex,
    searchChurch,
    currentViewChurches,
    setCurrentViewChurches,
  } = useCurrentChurchStore();

  useEffect(() => {
    const churchesBySex = currentChurchSex === "male" ? churchMaleArray : churchFemaleArray;
    const filteredChurches = churchesBySex?.filter((church) => {
      if (searchChurch) {
        return searchChurch === church.churchName;
      } else {
        return true;
      }
    });
    setCurrentViewChurches(filteredChurches || null);
  }, [churchMaleArray, churchFemaleArray, currentChurchSex, searchChurch, setCurrentViewChurches]);

  return (
    <ChurchList>
      <SelectSexButtonGroup />
      {currentViewChurches?.map((church) => (
        <ChurchItem key={church.churchName} church={church} dragFrom="sidebar" type="sidebar" />
      ))}
    </ChurchList>
  );
};

export default ChurchListContainer;

const ChurchList = styled(Stack)`
  ${mixinFlex("column", "start", "center")}
  width: 100%;
  height: 100%;
  max-height: 804px;
  padding: 26px 18px;
  row-gap: 14px;
  overflow-y: auto;
  ${mixinHideScrollbar}
`;
