import { create } from "zustand";

interface EditDormitoryModalStoreType {
  // 모달 열기 닫기
  isEditDormitoryModalOpen: boolean;
  setIsEditDormitoryModalOpen: (isEditDormitoryModalOpen: boolean) => void;

  // 사용 층 번호
  useSelectableFloorNumbers: number[];
  setUseSelectableFloorNumbers: (useSelectableFloorNumbers: number[]) => void;
}

export const useEditDormitoryModalStore = create<EditDormitoryModalStoreType>((set) => ({
  // 모달 열기 닫기
  isEditDormitoryModalOpen: false,
  setIsEditDormitoryModalOpen: (isEditDormitoryModalOpen: boolean) => set({ isEditDormitoryModalOpen }),

  // 사용 층 번호
  useSelectableFloorNumbers: [2, 3, 4, 5, 7, 8, 9, 10],
  setUseSelectableFloorNumbers: (useSelectableFloorNumbers: number[]) => set({ useSelectableFloorNumbers }),
}));
