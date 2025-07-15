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

  ////////// 자동 배정 함수
  function handleAutoAssign() {
    const { dormitoryData } = useDormitoryStore.getState();
    const { churchMaleArray, churchFemaleArray } = useCurrentChurchStore.getState();

    if (churchMaleArray && churchFemaleArray && dormitoryData) {
      if (!churchMaleArray && !churchFemaleArray) {
        return;
      }

      // 남자 교회 배정
      for (const { churchName } of churchMaleArray) {
        const { churchMaleArray: currentChurchMaleArray } = useCurrentChurchStore.getState();

        if (!currentChurchMaleArray) {
          continue;
        }

        const targetChurch = currentChurchMaleArray.filter((el) => el.churchName === churchName)[0];

        if (!targetChurch) {
          continue;
        }

        if (targetChurch.people <= 0) {
          continue;
        }

        // 자동배정
        autoAssign({ sex: "male", church: targetChurch });

        continue;
      }

      // 여자 교회 배정
      for (const { churchName } of churchFemaleArray) {
        const { churchFemaleArray: currentChurchFemaleArray } = useCurrentChurchStore.getState();

        if (!currentChurchFemaleArray) {
          continue;
        }

        const targetChurch = currentChurchFemaleArray.filter((el) => el.churchName === churchName)[0];

        if (!targetChurch) {
          continue;
        }

        if (targetChurch.people <= 0) {
          continue;
        }

        // 자동배정
        autoAssign({ sex: "female", church: targetChurch });

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
