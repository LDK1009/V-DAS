import { useCampManageStore } from "@/store/admin/manage/CampManageStore";
import { mixinFlex, mixinHideScrollbar } from "@/styles/mixins";
import { Stack, styled } from "@mui/material";
import React, { useEffect } from "react";
import CampItem from "./CampItem";
import { enqueueSnackbar } from "notistack";
import ExceptModal from "./ExceptModal";

const ManageArea = () => {
  const { fetchCampHistory, campHistory } = useCampManageStore();

  useEffect(() => {
    fetchCampHistory();
  }, [fetchCampHistory]);

  useEffect(() => {
    if (!campHistory) return;

    const publicCampsLength = campHistory.filter((camp) => camp.is_public).length;
    if (publicCampsLength > 1) {
      enqueueSnackbar("공개된 숙소배정이 2개 이상입니다.", {
        variant: "error",
      });
    }

    if (publicCampsLength === 1) {
      enqueueSnackbar("숙소배정이 공개되었습니다.", {
        variant: "success",
      });
    }
  }, [campHistory]);

  return (
    <Container>
      <Header>배정 기록</Header>
      <BodyArea>
        <CampHistoryContainer>
          {campHistory.map((camp) => (
            <CampItem key={camp.id} campData={camp} />
          ))}
        </CampHistoryContainer>
      </BodyArea>
      <ExceptModal />
    </Container>
  );
};

export default ManageArea;

const Container = styled(Stack)`
  ${mixinFlex("column", "start", "center")}
  width: 100%;
  max-width: 1200px;
  height: 600px;
  background-color: white;
  border-radius: 16px 16px 0px 0px;
  overflow: hidden;
  border: 1px solid #dadada;
`;

const Header = styled(Stack)`
  ${mixinFlex("row", "start", "center")}
  width: 100%;
  height: 70px;
  padding-left: 20px;
  font-size: 25px;
  color: ${({ theme }) => theme.palette.text.white};
  background-color: #ffc300;
`;

const BodyArea = styled(Stack)`
  ${mixinFlex("column", "start", "start")}
  width: 100%;
  height: 530px;
  max-height: 100%;
  padding: 24px;
  box-sizing: border-box;
`;

const CampHistoryContainer = styled(Stack)`
  ${mixinFlex("column", "start", "start")}
  row-gap: 16px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  ${mixinHideScrollbar}
`;
