import { mixinFlex, mixinMuiButtonNoShadow } from "@/styles/mixins";
import { Button, Fade, Stack, styled } from "@mui/material";
import React, { useState } from "react";
import html2canvas from "html2canvas";
import { useCardFormat } from "@/hooks/export/card/useCardFormat";
import { enqueueSnackbar, closeSnackbar } from "notistack";
import JSZip from "jszip";
import {
  addSheetData,
  createSheet,
  downloadExcel,
  excelToJson,
  formatFromDormitoryToRow,
  getLastDataPosition,
  getSheet,
  getSheetData,
  initExcel,
  sortByChurchName,
} from "@/utils/export/excel";
import { useExcelStore } from "@/store/excel/excelStore";
import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";

const Footer = () => {
  const [isDownloadOptionOpen, setIsDownloadOptionOpen] = useState(false);
  const { getAllChurchCardData } = useCardFormat();
  const churchCardDatas = getAllChurchCardData();
  const { excelFile } = useExcelStore();
  const { dormitoryData } = useDormitoryStore.getState();

  ////////// 카드 이미지 다운로드
  const downloadCardsAsZip = async () => {
    const cards = document.querySelectorAll(".assign-card");
    const zip = new JSZip();

    // 토스트 ID를 저장하여 나중에 닫을 수 있도록 함
    const toastId = enqueueSnackbar("카드 이미지 생성 중...", {
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
        const fileName = `${churchData.churchName}-배정카드.png`;
        const safeFileName = fileName.replace(/[\\/:*?"<>|]/g, "_");

        zip.file(safeFileName, imageData, { base64: true });
      }

      const content = await zip.generateAsync({ type: "blob" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "배정카드.zip";
      link.click();

      URL.revokeObjectURL(link.href);

      // 진행 중이던 토스트 닫기
      closeSnackbar(toastId);

      // 완료 메시지 표시
      enqueueSnackbar("다운로드가 완료되었습니다.", {
        variant: "success",
      });
    } catch (error) {
      // 에러 발생 시 진행 중이던 토스트 닫기
      closeSnackbar(toastId);

      console.error("ZIP 파일 생성 중 오류 발생:", error);
      enqueueSnackbar("다운로드 중 오류가 발생했습니다.", {
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
    const toastId = enqueueSnackbar("라벨지 이미지 생성 중...", {
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
        const fileName = `배정표${i + 1}.png`;
        const safeFileName = fileName.replace(/[\\/:*?"<>|]/g, "_");

        zip.file(safeFileName, imageData, { base64: true });
      }

      const content = await zip.generateAsync({ type: "blob" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "배정표.zip";
      link.click();

      URL.revokeObjectURL(link.href);

      // 진행 중이던 토스트 닫기
      closeSnackbar(toastId);

      // 완료 메시지 표시
      enqueueSnackbar("다운로드가 완료되었습니다.", { variant: "success" });
    } catch (error) {
      // 에러 발생 시 진행 중이던 토스트 닫기
      closeSnackbar(toastId);

      console.error("ZIP 파일 생성 중 오류 발생:", error);
      enqueueSnackbar("다운로드 중 오류가 발생했습니다.", { variant: "error" });
    }
  };

  ////////// 엑셀 다운로드
  const downloadExcelFile = async () => {
    try {
      ////////// 워크북&시트 초기화
      const { wb } = initExcel();
      const sheet1 = createSheet(wb, "데이터");
      const sheet2 = createSheet(wb, "숙소 배정");

      ////////// 시트1 작업
      // 업로드된 엑셀 파일 읽기
      const excelData = await excelToJson(excelFile as File);
      // 교회명 기준 오름차순 정렬
      const sortedData = sortByChurchName(excelData);
      // 시트1에 데이터추가
      addSheetData(sheet1, sortedData, "A1");

      ////////// 시트2 작업
      if(!dormitoryData) return;

      const formattedData = formatFromDormitoryToRow(dormitoryData);
      // 시트2에 데이터추가
      addSheetData(sheet2, formattedData, "A1", true);
      console.log(formattedData);


      downloadExcel(wb, "배정표.xlsx");
    } catch (error) {
      console.error("엑셀 다운로드 중 오류 발생:", error);
      enqueueSnackbar("다운로드 중 오류가 발생했습니다.", { variant: "error" });
    }
  };

  return (
    <Container>
      <StyledButton variant="contained">저장하기</StyledButton>
      <DownloadButtonWrapper>
        <StyledButton variant="contained" onClick={() => setIsDownloadOptionOpen((prev) => !prev)}>
          다운로드
        </StyledButton>
        <DownloadOptionFade in={isDownloadOptionOpen}>
          <DownloadOptionContainer>
            <StyledButton variant="contained">전체</StyledButton>
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
