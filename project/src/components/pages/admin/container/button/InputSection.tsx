import { useExcelStore } from "@/store/excel/excelStore";
import React from "react";

const InputSection = () => {
  const { setExcelFile } = useExcelStore();

  return (
    <div>
      <input type="file" onChange={(e) => setExcelFile(e.target.files?.[0] || null)} />
      <button>Upload</button>
    </div>
  );
};

export default InputSection;
