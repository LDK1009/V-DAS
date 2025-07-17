import { ChurchArrayType } from "@/types/currentChurchType";
import { produce } from "immer";
import { create } from "zustand";

// Zustand 스토어 정의

type CurrentChurchStoreType = {
  ////////// 현재 보고있는 교회 리스트
  currentViewChurches: ChurchArrayType | null;
  setCurrentViewChurches: (currentViewChurches: ChurchArrayType | null) => void;

  ////////// 교회 리스트
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

  ////////// 교회 검색어
  searchChurch: string;
  setSearchChurch: (searchChurch: string) => void;

  ////////// 교회 추가
  addChurch: (sex: "male" | "female", churchName: string, churchCount: number) => void;
};

export const useCurrentChurchStore = create<CurrentChurchStoreType>()((set) => ({
  ////////// 현재 보고있는 교회 리스트
  currentViewChurches: null,
  setCurrentViewChurches: (currentViewChurches) => set({ currentViewChurches }),

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
      // const currentChurchMaleCount = state.churchMaleArray?.find((church) => church.churchName === churchName)?.people;

      // if (currentChurchMaleCount === 0) return state;

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
      // const currentChurchFemaleCount = state.churchFemaleArray?.find(
      //   (church) => church.churchName === churchName
      // )?.people;

      // if (currentChurchFemaleCount === 0) return state;

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

  ////////// 교회 검색어
  searchChurch: "",
  setSearchChurch: (searchChurch) => set({ searchChurch }),

  ////////// 교회 추가
  addChurch: (sex, churchName, churchCount) => {
    set(produce((state) => {
      if(sex === "male"){
        const newChurchMaleArray = [...state.churchMaleArray, { churchName, people: churchCount }];
        state.churchMaleArray = newChurchMaleArray;
      }
      if(sex === "female"){
        const newChurchFemaleArray = [...state.churchFemaleArray, { churchName, people: churchCount }];
        state.churchFemaleArray = newChurchFemaleArray;
      }
      })
    );
  },
}));
