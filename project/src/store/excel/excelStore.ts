import { create } from "zustand";

// Zustand 스토어 정의

type ExcelStoreType = {
  excelFile: File | null;
  setExcelFile: (excelFile: File | null) => void;
  initExcelFile: () => void;
}

export const useExcelStore = create<ExcelStoreType>()((set) => ({
  excelFile: null,
  setExcelFile: (excelFile) => set({ excelFile }),
  initExcelFile: () => set({ excelFile: null }),
}));
