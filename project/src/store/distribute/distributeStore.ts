import { ChurchArrayType } from "@/types/currentChurchType";
import { produce } from "immer";
import { create } from "zustand";

// 타입 정의
type DistributeStoreType = {
  churchCards: CampType | null;
  setCurrentViewCamps: (currentViewCamps: CampType | null) => void;  
};

export const useDistributeStore = create<DistributeStoreType>()((set) => ({
  currentViewChurches: null,
  setCurrentViewChurches: (currentViewChurches) => set({ currentViewChurches }),

}));
