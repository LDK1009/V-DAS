import { ChurchCardType } from "@/types/camp";
import { create } from "zustand";

// 타입 정의
type distributeDataType = {
  round: number;
  churchCards: ChurchCardType[];
};
type DistributeStoreType = {
  distributeData: distributeDataType | null;
  setDistributeData: (distributeData: distributeDataType | null) => void;
};

export const useDistributeStore = create<DistributeStoreType>()((set) => ({
  distributeData: null,
  setDistributeData: (distributeData) => set({ distributeData }),
}));
