import { useExcelStore } from "@/store/excel/excelStore";
import { readExcelFile } from "@/utils/excel/read";
import React, { useEffect } from "react";

const InputSection = () => {
  const { excelFile, setExcelFile, initExcelFile } = useExcelStore();

  useEffect(() => {
    console.log(excelFile);

    if (excelFile) {
      readExcelFile(excelFile).then((data) => {
        console.log(data);
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
