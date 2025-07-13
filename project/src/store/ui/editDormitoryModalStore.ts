import { create } from "zustand";

interface EditDormitoryModalStoreType {
  // 상태
  isEditDormitoryModalOpen: boolean;

  // 액션
  setIsEditDormitoryModalOpen: (isEditDormitoryModalOpen: boolean) => void;
}

export const useEditDormitoryModalStore = create<EditDormitoryModalStoreType>((set) => ({
  // 상태
  isEditDormitoryModalOpen: false,

  // 액션
  setIsEditDormitoryModalOpen: (isEditDormitoryModalOpen: boolean) => set({ isEditDormitoryModalOpen }),
}));
