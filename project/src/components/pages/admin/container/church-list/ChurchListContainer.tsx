import { useCurrentChurchStore } from "@/store/church/churchStore";
import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { useExcelStore } from "@/store/excel/excelStore";
import { ChurchObject, FormattedExcelData } from "@/types/excel";
import { formatExcelData } from "@/utils/excel/format";
import { readExcelFile } from "@/utils/excel/read";
import React, { useEffect } from "react";
import ChurchItem from "./ChurchItem";
import { Stack, styled } from "@mui/material";
import { mixinFlex, mixinHideScrollbar } from "@/styles/mixins";

const ChurchListContainer = () => {
  const { excelFile } = useExcelStore();
  const { churchMaleArray, setCurrentChurchMaleArray, setCurrentChurchFemaleArray } = useCurrentChurchStore();
  const { dormitoryData } = useDormitoryStore();

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

  useEffect(() => {
    console.log(dormitoryData);
  }, [dormitoryData]);

  return (
    <ChurchList>
      {churchMaleArray?.map((church) => (
        <ChurchItem key={church.churchName} church={church} />
      ))}
    </ChurchList>
  );
};

export default ChurchListContainer;

const ChurchList = styled(Stack)`
  ${mixinFlex("column", "start", "center")}
  width: 100%;
  height: 100%;
  padding: 26px 18px;
  row-gap: 14px;
  overflow-y: auto;
  ${mixinHideScrollbar}
`;
