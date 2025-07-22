import { mixinFlex } from "@/styles/mixins";
import { CampsTableType } from "@/types/camp";
import { Stack, styled } from "@mui/material";
import React from "react";
import { shouldForwardProp } from "@/utils/mui";
import { formatDate } from "@/utils/time";
import { Edit, Public, PublicOff } from "@mui/icons-material";
import { useCampManageStore } from "@/store/admin/manage/CampManageStore";

type PropsType = {
  campData: CampsTableType;
};

const CampItem = ({ campData }: PropsType) => {
  const { round, updated_at, is_public } = campData;
  const { setUpdateCampPublic } = useCampManageStore();

  return (
    <Container $isPublic={is_public}>
      <RoundColumn>{round}차 숙소배정</RoundColumn>
      <UpdatedAtColumn>{formatDate(updated_at, "dot")}</UpdatedAtColumn>
      <PublicColumn>{is_public ? <PublicIcon onClick={() => setUpdateCampPublic(campData.id)} /> : <PublicOffIcon onClick={() => setUpdateCampPublic(campData.id)} />}</PublicColumn>
      <EditColumn>
        <EditIcon $isPublic={is_public} />
      </EditColumn>
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
