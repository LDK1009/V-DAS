import { ChurchArrayType } from "@/types/currentChurchType";
import { create } from "zustand";

// Zustand 스토어 정의

type CurrentChurchStoreType = {
  churchMaleArray: ChurchArrayType | null;
  churchFemaleArray: ChurchArrayType | null;
  setCurrentChurchMaleArray: (churchMaleArray: ChurchArrayType | null) => void;
  setCurrentChurchFemaleArray: (churchArray: ChurchArrayType | null) => void;
  initCurrentChurch: () => void;

  subtractChurchMale: (churchName: string, count: number) => void;
  subtractChurchFemale: (churchName: string, count: number) => void;
};

export const useCurrentChurchStore = create<CurrentChurchStoreType>()((set) => ({
  churchMaleArray: null,
  churchFemaleArray: null,
  setCurrentChurchMaleArray: (churchMaleArray) => set({ churchMaleArray }),
  setCurrentChurchFemaleArray: (churchFemaleArray) => set({ churchFemaleArray }),
  initCurrentChurch: () => set({ churchMaleArray: null, churchFemaleArray: null }),

  subtractChurchMale: (churchName, count) => {
    set((state) => ({
      churchMaleArray: state.churchMaleArray?.map((church) =>
        church.churchName === churchName ? { ...church, people: church.people - count } : church
      ),
    }));
  },

  subtractChurchFemale: (churchName, count) => {
    set((state) => ({
      churchFemaleArray: state.churchFemaleArray?.map((church) =>
        church.churchName === churchName ? { ...church, people: church.people - count } : church
      ),
    }));
  },
}));
