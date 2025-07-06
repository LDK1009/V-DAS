import { CurrentChurchMaleArrayType, CurrentChurchFemaleArrayType } from "@/types/currentChurchType";
import { create } from "zustand";

// Zustand 스토어 정의

type CurrentChurchStoreType = {
    currentChurchMaleArray: CurrentChurchMaleArrayType | null;
    currentChurchFemaleArray: CurrentChurchFemaleArrayType | null;
    setCurrentChurchMaleArray: (currentChurchMaleArray: CurrentChurchMaleArrayType | null) => void;
    setCurrentChurchFemaleArray: (currentChurchFemaleArray: CurrentChurchFemaleArrayType | null) => void;
    initCurrentChurch: () => void;
};

export const useCurrentChurchStore = create<CurrentChurchStoreType>()((set) => ({
    currentChurchMaleArray: null,
    currentChurchFemaleArray: null,
    setCurrentChurchMaleArray: (currentChurchMaleArray) => set({ currentChurchMaleArray }),
    setCurrentChurchFemaleArray: (currentChurchFemaleArray) => set({ currentChurchFemaleArray }),
    initCurrentChurch: () => set({ currentChurchMaleArray: null, currentChurchFemaleArray: null }),
}));
