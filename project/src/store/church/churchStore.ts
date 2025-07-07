import { ChurchArrayType } from "@/types/currentChurchType";
import { create } from "zustand";

// Zustand 스토어 정의

type CurrentChurchStoreType = {
  churchMaleArray: ChurchArrayType | null;
  churchFemaleArray: ChurchArrayType | null;
  setCurrentChurchMaleArray: (churchMaleArray: ChurchArrayType | null) => void;
  setCurrentChurchFemaleArray: (churchArray: ChurchArrayType | null) => void;
  initCurrentChurch: () => void;

  evacuateChurchMale: (churchName: string, count: number) => void;
  evacuateChurchFemale: (churchName: string, count: number) => void;
};

export const useCurrentChurchStore = create<CurrentChurchStoreType>()((set) => ({
  churchMaleArray: null,
  churchFemaleArray: null,
  setCurrentChurchMaleArray: (churchMaleArray) => set({ churchMaleArray }),
  setCurrentChurchFemaleArray: (churchFemaleArray) => set({ churchFemaleArray }),
  initCurrentChurch: () => set({ churchMaleArray: null, churchFemaleArray: null }),

  evacuateChurchMale: (churchName, count) => {
    set((state) => {
      const currentChurchMaleCount = state.churchMaleArray?.find((church) => church.churchName === churchName)?.people;

      if (currentChurchMaleCount === 0) return state;

      const newChurchMaleArray = state.churchMaleArray?.map((church) =>
        church.churchName === churchName ? { ...church, people: church.people - count } : church
      );

      return {
        churchMaleArray: newChurchMaleArray,
      };
    });
  },

  evacuateChurchFemale: (churchName, count) => {
    set((state) => {
      const currentChurchFemaleCount = state.churchFemaleArray?.find((church) => church.churchName === churchName)?.people;

      if (currentChurchFemaleCount === 0) return state;

      const newChurchFemaleArray = state.churchFemaleArray?.map((church) =>
        church.churchName === churchName ? { ...church, people: church.people - count } : church
      );

      return {
        churchFemaleArray: newChurchFemaleArray,
      };
    });
  },
}));
