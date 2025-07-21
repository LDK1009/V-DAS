import { create } from "zustand";
import { produce } from "immer";
import { enqueueSnackbar } from "notistack";

type UseFloorStoreType = {
  // 선택된 성별
  selectedSex: "male" | "female";
  setSelectedSex: (sex: "male" | "female") => void;

  // 사용층 관련
  useFloorNumbers: {
    male: number[];
    female: number[];
  };
  setUseFloorNumbers: (useFloorNumbers: { male: number[]; female: number[] }) => void;
  handleSelectUseFloor: (floorNumber: number) => void;
};

export const useFloorStore = create<UseFloorStoreType>()((set) => ({
  // 선택된 성별
  selectedSex: "male",
  setSelectedSex: (sex) => set({ selectedSex: sex }),

  // 사용층 관련
  useFloorNumbers: {
    male: [2, 3, 4, 5],
    female: [7, 8, 9,10],
  },
  setUseFloorNumbers: (useFloorNumbers) => set({ useFloorNumbers }),

  // 층 선택 핸들러
  handleSelectUseFloor: (floorNumber) =>
    set(
      produce((state) => {
        const sex = state.selectedSex;
        const allUseFloor = [...state.useFloorNumbers.male, ...state.useFloorNumbers.female];

        // 이미 추가된 층인 경우
        if (allUseFloor.includes(floorNumber)) {
          const newMaleUseFloor = state.useFloorNumbers.male.filter((number: number) => number !== floorNumber);
          const newFemaleUseFloor = state.useFloorNumbers.female.filter((number: number) => number !== floorNumber);

          if (newMaleUseFloor.length === 0 || newFemaleUseFloor.length === 0) {
            enqueueSnackbar("최소 1개의 층을 선택해주세요.", { variant: "error" });
            return;
          }

          state.useFloorNumbers.male = newMaleUseFloor;
          state.useFloorNumbers.female = newFemaleUseFloor;
          return;
        }

        // 추가되지 않은 층인 경우
        state.useFloorNumbers[sex].push(floorNumber);
      })
    ),
}));
