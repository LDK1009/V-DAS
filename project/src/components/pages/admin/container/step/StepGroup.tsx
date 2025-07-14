import React from "react";
import StepCard from "./StepCard";
import SettingsIcon from "@mui/icons-material/Settings";
import { Stack, styled } from "@mui/material";
import { mixinFlex } from "@/styles/mixins";
import { useCurrentChurchStore } from "@/store/church/churchStore";
import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { useAssign } from "@/hooks/assign/useAssign";
import FileUploadStepCard from "./FileUploadStepCard";
import { useEditDormitoryModalStore } from "@/store/ui/editDormitoryModalStore";
import DormitorySettingModal from "./modal/DormitorySettingModal";
import { AutoAwesomeRounded } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";

const StepGroup = () => {
  const { autoAssign } = useAssign();
  const { setIsEditDormitoryModalOpen } = useEditDormitoryModalStore();

  function handleAutoAssign() {
    const { dormitoryData } = useDormitoryStore.getState();
    const { churchMaleArray, churchFemaleArray } = useCurrentChurchStore.getState();

    if (churchMaleArray && churchFemaleArray && dormitoryData) {
      if (!churchMaleArray) {
        return;
      }

      for (const { churchName, people } of churchMaleArray) {
        console.log("\n\n\n\n==========", `${churchName}(${people})`, "배정 시작==========");

        const { churchMaleArray: currentChurchMaleArray } = useCurrentChurchStore.getState();

        if (!currentChurchMaleArray) {
          continue;
        }

        const targetChurch = currentChurchMaleArray.filter((el) => el.churchName === churchName)[0];

        if (!targetChurch) {
          continue;
        }

        if (targetChurch.people <= 0) {
          console.log(`${targetChurch.churchName} | ${targetChurch.people} 인원이 0명 이하입니다. 배정 불가능`);
          continue;
        }

        // if (targetChurch.people < maxRoomPeople) {
        //   assignSmallChurch({ sex: "male", church: targetChurch });
        //   continue;
        // }

        // 자동배정
        autoAssign({ sex: "male", church: targetChurch });

        continue;
      }
    }
  }

  const stepCards = [
    {
      cardText: "기숙사 설정",
      label: "설정하기",
      buttonIcon: <SettingsIcon />,
      onClick: () => {
        setIsEditDormitoryModalOpen(true);
      },
    },
    {
      cardText: "자동 배정",
      label: "배정하기",
      buttonIcon: <AutoAwesomeRounded />,
      onClick: () => {
        handleAutoAssign();
        enqueueSnackbar("자동 배정이 완료되었습니다.", {
          variant: "success",
        });
      },
    },
  ];

  return (
    <Container>
      <FileUploadStepCard />
      {stepCards.map((stepCard, index) => (
        <StepCard key={stepCard.label} stepNumber={index + 2} {...stepCard} />
      ))}
      <DormitorySettingModal />
    </Container>
  );
};

export default StepGroup;

const Container = styled(Stack)`
  ${mixinFlex("row", "center", "center")}
  width: 100%;
  column-gap: 12px;
`;
