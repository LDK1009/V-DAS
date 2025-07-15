import { ChurchArrayType } from "@/types/currentChurchType";
import { create } from "zustand";

// Zustand 스토어 정의

type CurrentChurchStoreType = {
  ////////// 교회 리스트 관련
  churchMaleArray: ChurchArrayType | null;
  churchFemaleArray: ChurchArrayType | null;
  ////////// 교회 리스트 세팅 액션
  setCurrentChurchMaleArray: (churchMaleArray: ChurchArrayType | null) => void;
  setCurrentChurchFemaleArray: (churchFemaleArray: ChurchArrayType | null) => void;

  ////////// 교회 리스트 초기화 액션
  initCurrentChurch: () => void;

  ////////// 교회 배정 액션
  evacuateChurchMale: (churchName: string, count: number) => void;
  evacuateChurchFemale: (churchName: string, count: number) => void;

  ////////// 현재 보고있는 교회 리스트 성별
  currentChurchSex: "male" | "female";
  setCurrentChurchSex: (currentChurchSex: "male" | "female") => void;
};

export const useCurrentChurchStore = create<CurrentChurchStoreType>()((set) => ({
  ////////// 교회 리스트 관련
  churchMaleArray: null,
  churchFemaleArray: null,

  ////////// 교회 리스트 세팅 액션
  setCurrentChurchMaleArray: (churchMaleArray) => set({ churchMaleArray }),
  setCurrentChurchFemaleArray: (churchFemaleArray) => set({ churchFemaleArray }),

  ////////// 교회 리스트 초기화 액션
  initCurrentChurch: () => set({ churchMaleArray: null, churchFemaleArray: null }),

  ////////// 교회 배정 액션
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
      const currentChurchFemaleCount = state.churchFemaleArray?.find(
        (church) => church.churchName === churchName
      )?.people;

      if (currentChurchFemaleCount === 0) return state;

      const newChurchFemaleArray = state.churchFemaleArray?.map((church) =>
        church.churchName === churchName ? { ...church, people: church.people - count } : church
      );

      return {
        churchFemaleArray: newChurchFemaleArray,
      };
    });
  },

  ////////// 현재 보고있는 교회 리스트 성별
  currentChurchSex: "male",
  setCurrentChurchSex: (currentChurchSex) => set({ currentChurchSex }),
}));
