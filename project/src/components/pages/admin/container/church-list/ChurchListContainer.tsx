import { useCurrentChurchStore } from "@/store/church/churchStore";
import { useExcelStore } from "@/store/excel/excelStore";
import { ChurchObject, FormattedExcelData } from "@/types/excel";
import { formatExcelData } from "@/utils/excel/format";
import { readExcelFile } from "@/utils/excel/read";
import React, { useEffect, useState } from "react";

const ChurchListContainer = () => {
  const { excelFile } = useExcelStore();
  const { currentChurchMaleArray, currentChurchFemaleArray, setCurrentChurchMaleArray, setCurrentChurchFemaleArray } =
    useCurrentChurchStore();

  useEffect(() => {
    // 파일 형식 변환
    if (excelFile) {
      readExcelFile(excelFile).then((data: ChurchObject[]) => {
        const formattedData: FormattedExcelData = formatExcelData(data);

        setCurrentChurchMaleArray(formattedData.maleDataArray);
        setCurrentChurchFemaleArray(formattedData.femaleDataArray);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excelFile]);

  return (
    <div>
      <pre>{JSON.stringify(currentChurchMaleArray, null, 2)}</pre>
      <pre>{JSON.stringify(currentChurchFemaleArray, null, 2)}</pre>
    </div>
  );
};

export default ChurchListContainer;
