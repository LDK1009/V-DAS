import { mixinFlex } from "@/styles/mixins";
import { CampsTableType } from "@/types/camp";
import { Stack, styled } from "@mui/material";
import React from "react";
import { shouldForwardProp } from "@/utils/mui";
import { formatDate } from "@/utils/time";
import { BrushRounded, Delete, Edit, Public, PublicOff } from "@mui/icons-material";
import { useCampManageStore } from "@/store/admin/manage/CampManageStore";
import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { useCurrentChurchStore } from "@/store/church/churchStore";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useExceptModalStore } from "@/store/ui/exceptModalStore";

type PropsType = {
  campData: CampsTableType;
};

const CampItem = ({ campData }: PropsType) => {
  const router = useRouter();
  const { round, updated_at, is_public } = campData;
  const { setUpdateCampPublic, setDeleteCamp } = useCampManageStore();
  const { setDormitoryData, setRound, setCurrentFloor, setMaxRoomPeople } = useDormitoryStore();
  const { setCurrentChurchFemaleArray, setCurrentChurchMaleArray } = useCurrentChurchStore();
  const { setIsExceptModalOpen } = useExceptModalStore();
  
  const handleEditClick = () => {
    const { round, church_list, dormitory_setting, dormitory } = campData;

    // 차수 세팅
    setRound(round);

    // 현재 층 세팅
    setCurrentFloor(dormitory_setting.useFloorNumbers.male[0]);
    // 최대 방 인원 세팅
    setMaxRoomPeople(dormitory_setting.maxRoomPeople);

    // 교회 리스트 세팅
    setCurrentChurchFemaleArray(church_list.female);
    setCurrentChurchMaleArray(church_list.male);

    // 기숙사 데이터 세팅
    setDormitoryData(dormitory);

    router.push("/admin/assign");
  };

  const handleDeleteClick = () => {
    const isConfirm = confirm("캠프를 삭제하시겠습니까?");
    if (isConfirm) {
      setDeleteCamp(campData.id);
      enqueueSnackbar(`${round}차 캠프 삭제`, { variant: "error" });
    }
  };

  return (
    <Container $isPublic={is_public}>
      <RoundColumn>{round}차 숙소배정</RoundColumn>
      <UpdatedAtColumn>{formatDate(updated_at, "dot")}</UpdatedAtColumn>
      <PublicColumn>
        {is_public ? (
          <PublicIcon onClick={() => setUpdateCampPublic(campData.id)} />
        ) : (
          <PublicOffIcon onClick={() => setUpdateCampPublic(campData.id)} />
        )}
      </PublicColumn>
      <EditColumn>
        <EditIcon $isPublic={is_public} onClick={handleEditClick} />
      </EditColumn>
      <ExceptionColumn>
        <ExceptionIcon $isPublic={is_public} onClick={() => setIsExceptModalOpen(true)} />
      </ExceptionColumn>
      <DeleteColumn>
        <DeleteIcon onClick={handleDeleteClick} />
      </DeleteColumn>
    </Container>
  );
};

export default CampItem;

type ContainerPropsType = {
  $isPublic: boolean;
};

const Container = styled(Stack, { shouldForwardProp })<ContainerPropsType>`
  ${mixinFlex("row", "start", "center")}
  width: 100%;
  height: 100%;
  border: 1px solid ${({ theme, $isPublic }) => ($isPublic ? theme.palette.primary.main : "#DADADA")};
  border-radius: 16px;

  & > .MuiStack-root {
    border-right: 1px solid ${({ theme, $isPublic }) => ($isPublic ? theme.palette.primary.main : "#DADADA")};
  }

  & > .MuiStack-root:nth-last-of-type(1) {
    border-right: none;
  }
`;

const ItemColumn = styled(Stack)`
  ${mixinFlex("row", "center", "center")}
  width: 100%;
  height: 60px;
`;

const RoundColumn = styled(ItemColumn)`
  flex: 1;
  justify-content: flex-start;
  padding-left: 24px;
`;

const UpdatedAtColumn = styled(ItemColumn)`
  flex: 1;
`;

const PublicColumn = styled(ItemColumn)`
  width: 100px;
`;

const PublicIcon = styled(Public)`
  color: ${({ theme }) => theme.palette.primary.main};
  cursor: pointer;
`;

const PublicOffIcon = styled(PublicOff)`
  color: ${({ theme }) => theme.palette.text.disabled};
  cursor: pointer;
`;

const EditColumn = styled(ItemColumn)`
  width: 100px;
`;

type EditIconPropsType = {
  $isPublic: boolean;
};

const EditIcon = styled(Edit, { shouldForwardProp })<EditIconPropsType>`
  color: ${({ theme, $isPublic }) => ($isPublic ? theme.palette.primary.main : theme.palette.text.disabled)};
  cursor: pointer;
`;

const DeleteColumn = styled(ItemColumn)`
  width: 100px;
`;

const DeleteIcon = styled(Delete)`
  color: ${({ theme }) => theme.palette.error.main};
  cursor: pointer;
`;

const ExceptionColumn = styled(ItemColumn)`
  width: 100px; 
`;

type ExceptionIconPropsType = {
  $isPublic: boolean;
};

const ExceptionIcon = styled(BrushRounded, { shouldForwardProp })<ExceptionIconPropsType>`
  color: ${({ theme, $isPublic }) => ($isPublic ? theme.palette.primary.main : theme.palette.text.disabled)};
  cursor: pointer;
`;