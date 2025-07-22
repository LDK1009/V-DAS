"use client";

import { mixinFlex, mixinMuiCircleShapeButton } from "@/styles/mixins";
import { ChurchCardType } from "@/types/camp";
import { Button, Stack, styled } from "@mui/material";
import React from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import AssignCard from "./container/AssignCard";
import { DownloadRounded, InsertLinkRounded, ShareRounded } from "@mui/icons-material";
import html2canvas from "html2canvas";
import { enqueueSnackbar } from "notistack";

type PropsType = {
  churchCardInfo: ChurchCardType;
};

const CardOfChurchNameContainer = ({ churchCardInfo }: PropsType) => {
  async function handleDownload() {
    const card = document.querySelector(".distribute-assign-card") as HTMLElement;
    if (!card) return;

    const canvas = await html2canvas(card, {
      scale: 2,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imageData = canvas.toDataURL("image/png").split(",")[1];
    const fileName = `${churchCardInfo.churchName}-숙소배정카드.png`;
    const safeFileName = fileName.replace(/[\\/:*?"<>|]/g, "_");

    // 카드 다운로드
    const link = document.createElement("a");
    link.download = safeFileName;
    link.href = `data:image/png;base64,${imageData}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleCopyLink() {
    const currentUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(currentUrl);
      enqueueSnackbar("링크가 복사되었습니다.", { variant: "success" });
    } catch {
      enqueueSnackbar("링크 복사에 실패했습니다.", { variant: "error" });
    }
  }

  function handleShare() {
    // @ts-expect-error - window.Kakao 타입이 전역에 정의되지 않음
    window.Kakao.Share.sendScrap({
      requestUrl: `${window.location.origin}/card/${churchCardInfo.churchName}`,
      templateId: 122683, 
      templateArgs: {
        title: `${churchCardInfo.churchName}`, 
        content: `${churchCardInfo.churchName} 숙소배정카드`, 
        churchName: churchCardInfo.churchName,
      },
    });
  }

  return (
    <Container>
      <Header />
      <AssignCard {...churchCardInfo} />
      <ButtonContainer>
        <IconButton onClick={handleDownload}>
          <DownloadRounded />
        </IconButton>
        <IconButton onClick={handleCopyLink}>
          <InsertLinkRounded />
        </IconButton>
        <IconButton onClick={handleShare}>
          <ShareRounded />
        </IconButton>
      </ButtonContainer>
      <Footer />
    </Container>
  );
};

export default CardOfChurchNameContainer;

const Container = styled(Stack)`
  ${mixinFlex("column", "start", "center")};
  width: 100vw;
  height: 100vh;

  padding: 126px 50px 0px 50px;
`;

const ButtonContainer = styled(Stack)`
  ${mixinFlex("row", "flex-end", "center")};
  column-gap: 8px;
  width: 100%;
  padding-top: 8px;
`;

const IconButton = styled(Button)`
  border-radius: 50%;
  ${mixinMuiCircleShapeButton(32)}
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.common.white};
`;
