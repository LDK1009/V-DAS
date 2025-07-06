import { useExcelStore } from "@/store/excel/excelStore";
import { ChurchObject, FormattedExcelData } from "@/types/excel";
import { formatExcelData } from "@/utils/excel/format";
import { readExcelFile } from "@/utils/excel/read";
import React, { useEffect, useState } from "react";

const ChurchListContainer = () => {
  const { excelFile } = useExcelStore();
  const [excelData, setExcelData] = useState<FormattedExcelData | null>(null);

  useEffect(() => {
    console.log(excelFile);

    // 파일 형식 변환
    if (excelFile) {
      readExcelFile(excelFile).then((data: ChurchObject[]) => {
        const formattedData: FormattedExcelData = formatExcelData(data);

        console.log("\n\n남자 데이터", formattedData.maleDataArray, "\n\n");
        console.log("\n\n여자 데이터", formattedData.femaleDataArray, "\n\n");
        setExcelData(formattedData);
      });
    }
  }, [excelFile]);

  return (
    <div>
      <pre>{JSON.stringify(excelData, null, 2)}</pre>
    </div>
  );
};

export default ChurchListContainer;
