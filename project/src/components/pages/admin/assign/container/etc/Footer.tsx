import { mixinFlex, mixinMuiButtonNoShadow } from "@/styles/mixins";
import { Button, Fade, Stack, styled } from "@mui/material";
import React, { useState } from "react";
import html2canvas from "html2canvas";
import { useCardFormat } from "@/hooks/export/card/useCardFormat";
import { enqueueSnackbar, closeSnackbar } from "notistack";
import JSZip from "jszip";

import {
  createSheet,
  downloadExcel,
  formatFromDormitoryToRow,
  initExcel,
  writeSheetDormitory,
  ////////// 임시 주석
  // excelToJson,
  // addSheetData,
  // sortByChurchName,
  ////////// 임시 주석
} from "@/utils/export/excel";
// import { useExcelStore } from "@/store/excel/excelStore";
import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { saveCamp } from "@/service/save/save";
import { useCurrentChurchStore } from "@/store/church/churchStore";
import { useFloorStore } from "@/store/dormitory/useFloorStore";

const Footer = () => {
  const [isDownloadOptionOpen, setIsDownloadOptionOpen] = useState(false);
  const { getAllChurchCardData } = useCardFormat();
  const churchCardDatas = getAllChurchCardData();
  ////////// 임시 주석
  // const { excelFile } = useExcelStore();
  const { dormitoryData, maxRoomPeople, round: currentRound } = useDormitoryStore();
  const { churchMaleArray, churchFemaleArray } = useCurrentChurchStore();
  const { useFloorNumbers } = useFloorStore();

  ////////// 카드 이미지 다운로드
  const downloadCardsAsZip = async () => {
    const cards = document.querySelectorAll(".assign-card");
    const zip = new JSZip();

    // 토스트 ID를 저장하여 나중에 닫을 수 있도록 함
    const toastId = enqueueSnackbar("카드 다운로드 중...", {
      variant: "info",
      persist: true, // 수동으로 닫을 때까지 토스트 유지
    });

    try {
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i] as HTMLElement;
        const churchData = churchCardDatas[i];

        const canvas = await html2canvas(card, {
          scale: 2,
          backgroundColor: "#ffffff",
          logging: false,
        });

        const imageData = canvas.toDataURL("image/png").split(",")[1];
        const fileName = `${churchData.churchName}-숙소배정카드.png`;
        const safeFileName = fileName.replace(/[\\/:*?"<>|]/g, "_");

        zip.file(safeFileName, imageData, { base64: true });
      }

      const content = await zip.generateAsync({ type: "blob" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "숙소배정 카드.zip";
      link.click();

      URL.revokeObjectURL(link.href);

      // 진행 중이던 토스트 닫기
      closeSnackbar(toastId);

      // 완료 메시지 표시
      enqueueSnackbar("카드 다운로드 완료", {
        variant: "success",
      });
    } catch (error) {
      // 에러 발생 시 진행 중이던 토스트 닫기
      closeSnackbar(toastId);

      console.error("ZIP 파일 생성 중 오류 발생:", error);
      enqueueSnackbar("카드 다운로드 중 오류가 발생했습니다.", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  ////////// 표 이미지 다운로드
  const downloadTableAsZip = async () => {
    const tables = document.querySelectorAll(".assign-table");
    const zip = new JSZip();

    // 토스트 ID를 저장하여 나중에 닫을 수 있도록 함
    const toastId = enqueueSnackbar("라벨지 다운로드 중...", {
      variant: "info",
      persist: true, // 수동으로 닫을 때까지 토스트 유지
    });

    try {
      for (let i = 0; i < tables.length; i++) {
        const table = tables[i] as HTMLElement;

        const canvas = await html2canvas(table, {
          scale: 1,
          backgroundColor: "#ffffff",
          logging: false,
        });

        const imageData = canvas.toDataURL("image/png").split(",")[1];
        const fileName = `숙소배정표${i + 1}.png`;
        const safeFileName = fileName.replace(/[\\/:*?"<>|]/g, "_");

        zip.file(safeFileName, imageData, { base64: true });
      }

      const content = await zip.generateAsync({ type: "blob" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "숙소배정표.zip";
      link.click();

      URL.revokeObjectURL(link.href);

      // 진행 중이던 토스트 닫기
      closeSnackbar(toastId);
      // 완료 메시지 표시
      enqueueSnackbar("라벨지 다운로드 완료", { variant: "success" });
    } catch (error) {
      // 에러 발생 시 진행 중이던 토스트 닫기
      closeSnackbar(toastId);

      console.error("ZIP 파일 생성 중 오류 발생:", error);
      enqueueSnackbar("라벨지 다운로드 중 오류가 발생했습니다.", { variant: "error" });
    }
  };

  ////////// 엑셀 다운로드
  const downloadExcelFile = async () => {
    const toastId = enqueueSnackbar("엑셀 다운로드 중...", {
      variant: "info",
      persist: true, // 수동으로 닫을 때까지 토스트 유지
    });

    try {
      ////////// 워크북&시트 초기화
      const { wb } = initExcel();

      ////////// 임시 주석
      // const sheet1 = createSheet(wb, "데이터");
      // const sheet2 = createSheet(wb, "숙소배정");

      ////////// 시트1 작업
      // 업로드된 엑셀 파일 읽기
      // const excelData = await excelToJson(excelFile as File);
      // 교회명 기준 오름차순 정렬
      // const sortedData = sortByChurchName(excelData);
      // 시트1에 데이터추가
      // addSheetData(sheet1, sortedData, "A1");
      ////////// 임시 주석

      const sheet2 = createSheet(wb, "숙소배정");

      ////////// 시트2 작업
      if (!dormitoryData) return;

      // 전체 데이터 포맷팅
      const formattedData = formatFromDormitoryToRow(dormitoryData);

      // 시트2에 데이터추가
      writeSheetDormitory({ ws: sheet2, dormitoryData: formattedData });

      // 엑셀 파일 다운로드
      downloadExcel(wb, "숙소배정.xlsx");

      // 진행 중이던 토스트 닫기
      closeSnackbar(toastId);
      // 완료 메시지 표시
      enqueueSnackbar("엑셀 다운로드 완료", { variant: "success" });
    } catch (error) {
      // 진행 중이던 토스트 닫기
      closeSnackbar(toastId);

      console.error("엑셀 다운로드 중 오류 발생:", error);
      enqueueSnackbar("엑셀 다운로드 중 오류가 발생했습니다.", { variant: "error" });
    }
  };

  ////////// 전체 다운로드
  const allDownload = async () => {
    await downloadCardsAsZip();
    await downloadTableAsZip();
    await downloadExcelFile();
  };

  ////////// 전체 다운로드
  const handleSave = async () => {
    try {
      const dormitory_setting = {
        useFloorNumbers: useFloorNumbers,
        maxRoomPeople: maxRoomPeople,
      };

      const church_list = {
        male: [...(churchMaleArray || [])],
        female: [...(churchFemaleArray || [])],
      };

      const dormitory = dormitoryData;

      const is_public = false;

      if (!currentRound || !dormitory_setting || !church_list || !dormitory || !churchCardDatas) {
        throw new Error("숙소배정 저장 실패 : 데이터가 존재하지 않습니다.");
      }

      const params = {
        round: currentRound,
        dormitory_setting,
        church_list,
        dormitory,
        is_public,
        church_cards: churchCardDatas,
      };

      await saveCamp(params);

      enqueueSnackbar("숙소배정 저장 완료", { variant: "success" });
    } catch {
      enqueueSnackbar("숙소배정 저장 실패", { variant: "error" });
    }
  };

  return (
    <Container>
      <StyledButton variant="contained" onClick={handleSave}>
        저장하기
      </StyledButton>
      <DownloadButtonWrapper>
        <StyledButton variant="contained" onClick={() => setIsDownloadOptionOpen((prev) => !prev)}>
          다운로드
        </StyledButton>
        <DownloadOptionFade in={isDownloadOptionOpen}>
          <DownloadOptionContainer>
            <StyledButton variant="contained" onClick={allDownload}>
              전체
            </StyledButton>
            <StyledButton variant="contained" onClick={downloadExcelFile}>
              엑셀
            </StyledButton>
            <StyledButton variant="contained" onClick={downloadCardsAsZip}>
              카드
            </StyledButton>
            <StyledButton variant="contained" onClick={downloadTableAsZip}>
              라벨지
            </StyledButton>
          </DownloadOptionContainer>
        </DownloadOptionFade>
      </DownloadButtonWrapper>
    </Container>
  );
};

export default Footer;

const Container = styled(Stack)`
  ${mixinFlex("row", "end", "center")}
  width: 100%;
  height: 53px;
  padding: 12px 16px;
  column-gap: 16px;
  border-top: 1px solid black;
`;

const StyledButton = styled(Button)`
  ${mixinMuiButtonNoShadow}
  width: 90px;
  height: 18px;
  border-radius: 12px;
`;

const DownloadButtonWrapper = styled(Stack)`
  position: relative;
`;

const DownloadOptionFade = styled(Fade)`
  position: absolute;
  bottom: calc(100% + 16px);
  left: 50%;
  transform: translateX(-50%);
`;

const DownloadOptionContainer = styled(Stack)`
  ${mixinFlex("column", "start", "start")}
  row-gap: 8px;
  background-color: white;
  border: 1px solid ${({ theme }) => theme.palette.primary.main};
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`;
