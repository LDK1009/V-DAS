import { useCurrentChurchStore } from "@/store/church/churchStore";
import { useExcelStore } from "@/store/excel/excelStore";
import { mixinFlex, mixinMuiButtonNoShadow } from "@/styles/mixins";
import { ChurchObject, FormattedExcelData } from "@/types/excel";
import { formatExcelData } from "@/utils/excel/format";
import { readExcelFile } from "@/utils/excel/read";
import { CheckCircleOutlineRounded, UploadFile } from "@mui/icons-material";
import { Box, Button, Stack, styled, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";

const FileUploadStepCard = () => {
  const { setExcelFile, excelFile } = useExcelStore();
  const { setCurrentChurchMaleArray, setCurrentChurchFemaleArray } = useCurrentChurchStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 확장자 검사
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (fileExtension !== "xlsx" && fileExtension !== "xls") {
        alert("엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.");
        return;
      }
      setExcelFile(file);
    }
  };

  useEffect(() => {
    // 파일 형식 변환
    if (excelFile) {
      readExcelFile(excelFile).then((data: ChurchObject[]) => {
        const formattedData: FormattedExcelData = formatExcelData(data);

        setCurrentChurchMaleArray(formattedData.churchMaleArray);
        setCurrentChurchFemaleArray(formattedData.churchFemaleArray);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excelFile]);

  return (
    <Container>
      {/* 헤더 */}
      <Header>
        {excelFile ? (
          <CheckCircle />
        ) : (
          <StepNumberCircle>
            <StepNumberText>1</StepNumberText>
          </StepNumberCircle>
        )}
        <CardText>엑셀 파일 업로드</CardText>
      </Header>
      {/* 버튼 */}
      <HiddenInput type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx,.xls" />
      <UploadButton onClick={handleButtonClick} startIcon={<UploadFile />}>
        업로드
      </UploadButton>
    </Container>
  );
};

export default FileUploadStepCard;

const Container = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  row-gap: 8px;
  width: 200px;
  height: 100px;
  border: 1px solid ${({ theme }) => theme.palette.primary.main};
  border-radius: 8px;
  padding: 16px;
`;

const Header = styled(Stack)`
  ${mixinFlex("row", "center", "center")}
  column-gap: 4px;
`;

const CheckCircle = styled(CheckCircleOutlineRounded)`
  color: ${({ theme }) => theme.palette.primary.main};
`;

const StepNumberCircle = styled(Box)`
  ${mixinFlex("row", "center", "center")}
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.text.white};
`;

const StepNumberText = styled(Typography)`
  width: 24px;
  height: 24px;
  text-align: center;
`;

const CardText = styled(Typography)`
  font-size: 14px;
`;

const HiddenInput = styled("input")`
  display: none;
`;

const UploadButton = styled(Button)`
  ${mixinMuiButtonNoShadow}
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.text.white};
  border-radius: 8px;

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary.dark};
  }
`;
