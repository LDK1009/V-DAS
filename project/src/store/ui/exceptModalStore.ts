import { getAllRounds } from "@/service/table/camps/camps";
import { ExceptionTableType } from "@/types/exceptions";
import { produce } from "immer";
import { create } from "zustand";

interface ExceptModalStoreType {
  // 상태
  isExceptModalOpen: boolean;
  exceptionRound: number | null;
  exceptions: ExceptionTableType[];
  rounds: number[];

  // 액션
  setIsExceptModalOpen: (isExceptModalOpen: boolean) => void;

  setExceptionRound: (exceptionRound: number) => void;
  setExceptions: (exceptions: ExceptionTableType[]) => void;
  addException: (exception: ExceptionTableType) => void;
  addNewException: () => void;
  updateException: (index: number, property: keyof ExceptionTableType, value: string | number) => void;
  updateNewAssigned: (index: number, property: keyof ExceptionTableType["new_assigned"], value: string | number) => void;

  getRounds: () => Promise<void>;
}

const initException: ExceptionTableType = {
  church_name: "",
  sex: "male",
  new_assigned: {
    totalAssignedCount: 0,
    AorB: "A",
    assignedText: "",
  },
};

export const useExceptModalStore = create<ExceptModalStoreType>((set) => ({
  // 상태
  isExceptModalOpen: false,
  exceptionRound: 0,
  exceptions: [initException],
  rounds: [],

  // 액션
  setIsExceptModalOpen: (isExceptModalOpen: boolean) => set({ isExceptModalOpen }),

  setExceptionRound: (exceptionRound: number) => set({ exceptionRound }),

  setExceptions: (exceptions: ExceptionTableType[]) => set({ exceptions }),
  addException: (exception: ExceptionTableType) => set((state) => ({ exceptions: [...state.exceptions, exception] })),
  addNewException: () =>
    set((state) => ({
      exceptions: [...state.exceptions, initException],
    })),

  updateException: (index: number, property: keyof ExceptionTableType, value: string | number) =>
    set(
      produce((state) => {
        state.exceptions[index][property] = value;
      })
    ),

  updateNewAssigned: (index: number, property: keyof ExceptionTableType["new_assigned"], value: string | number) =>
    set(
      produce((state) => {
        state.exceptions[index].new_assigned[property] = value;
      })
    ),

  getRounds: async () => {
    const rounds = await getAllRounds();
    set({ rounds: rounds?.map((round) => round.round) || [] });
  },
}));
