import { useExcelStore } from "@/store/excel/excelStore";
import { ChurchObject, FormattedExcelData } from "@/types/excel";
import { formatExcelData } from "@/utils/excel/format";
import { readExcelFile } from "@/utils/excel/read";
import React, { useEffect } from "react";

const InputSection = () => {
  const { excelFile, setExcelFile, initExcelFile } = useExcelStore();

  useEffect(() => {
    console.log(excelFile);

    // 파일 형식 변환
    if (excelFile) {
      readExcelFile(excelFile).then((data: ChurchObject[]) => {
        const formattedData: FormattedExcelData = formatExcelData(data);

        console.log("\n\n남자 데이터", formattedData.maleDataArray, "\n\n");
        console.log("\n\n여자 데이터", formattedData.femaleDataArray, "\n\n");
      });
    }
  }, [excelFile]);

  return (
    <div>
      <input type="file" onChange={(e) => setExcelFile(e.target.files?.[0] || null)} />
      <button>Upload</button>
    </div>
  );
};

export default InputSection;
