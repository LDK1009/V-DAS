import { useCurrentChurchStore } from "@/store/church/churchStore";
import React, { useEffect } from "react";
import ChurchItem from "./ChurchItem";
import { Stack, styled } from "@mui/material";
import { mixinFlex, mixinHideScrollbar } from "@/styles/mixins";
import SelectSexButtonGroup from "./SelectSexButtonGroup";
import AddCurchButton from "./AddCurchButton";

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
    <Container>
      <SelectSexButtonGroup />
      <ChurchList>
        {currentViewChurches?.map((church) => (
          <ChurchItem key={church.churchName} church={church} dragFrom="sidebar" type="sidebar" />
        ))}
        {currentViewChurches?.length && currentViewChurches.length > 0 && <AddCurchButton />}
      </ChurchList>
    </Container>
  );
};

export default ChurchListContainer;

const Container = styled(Stack)`
  position: relative;
  ${mixinFlex("column", "start", "stretch")}
  width: 100%;
  height: 100%;
  max-height: 804px;
  padding-top: 64px;
  padding-bottom: 32px;
`;

const ChurchList = styled(Stack)`
  ${mixinFlex("column", "start", "center")}
  width: 100%;
  height: 100%;
  max-height: 750px;
  row-gap: 14px;
  overflow-y: auto;
  ${mixinHideScrollbar}
`;
