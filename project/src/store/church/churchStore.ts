import { CurrentChurchMaleArrayType, CurrentChurchFemaleArrayType } from "@/types/currentChurchType";
import { create } from "zustand";

// Zustand 스토어 정의

type CurrentChurchStoreType = {
  currentChurchMaleArray: CurrentChurchMaleArrayType | null;
  currentChurchFemaleArray: CurrentChurchFemaleArrayType | null;
  setCurrentChurchMaleArray: (currentChurchMaleArray: CurrentChurchMaleArrayType | null) => void;
  setCurrentChurchFemaleArray: (currentChurchFemaleArray: CurrentChurchFemaleArrayType | null) => void;
  initCurrentChurch: () => void;

  subtractChurchMale: (churchName: string, count: number) => void;
  subtractChurchFemale: (churchName: string, count: number) => void;
};

export const useCurrentChurchStore = create<CurrentChurchStoreType>()((set) => ({
  currentChurchMaleArray: null,
  currentChurchFemaleArray: null,
  setCurrentChurchMaleArray: (currentChurchMaleArray) => set({ currentChurchMaleArray }),
  setCurrentChurchFemaleArray: (currentChurchFemaleArray) => set({ currentChurchFemaleArray }),
  initCurrentChurch: () => set({ currentChurchMaleArray: null, currentChurchFemaleArray: null }),

  subtractChurchMale: (churchName, count) => {
    set((state) => ({
      currentChurchMaleArray: state.currentChurchMaleArray?.map((church) =>
        church.churchName === churchName ? { ...church, male: church.male - count } : church
      ),
    }));
  },
  subtractChurchFemale: (churchName, count) => {
    set((state) => ({
      currentChurchFemaleArray: state.currentChurchFemaleArray?.map((church) =>
        church.churchName === churchName ? { ...church, female: church.female - count } : church
      ),
    }));
  },
}));
