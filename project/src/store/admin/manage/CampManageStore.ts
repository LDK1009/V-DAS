import { changeCampPublic, deleteCamp, getAllCamps } from "@/service/table/camps/camps";
import { CampsTableType } from "@/types/camp";
import { create } from "zustand";

type CampManageStoreType = {
  campHistory: CampsTableType[];
  setCampHistory: (value: CampsTableType[]) => void;
  fetchCampHistory: () => Promise<void>;
  setUpdateCampPublic: (targetCampId: number) => Promise<void>;
  setDeleteCamp: (targetCampId: number) => Promise<void>;
};

export const useCampManageStore = create<CampManageStoreType>((set, get) => ({
  campHistory: [],
  setCampHistory: (value) => set({ campHistory: value }),
  fetchCampHistory: async () => {
    const data = await getAllCamps();
    if (!data) throw new Error("캠프 정보 조회 실패");
    set({ campHistory: data });
  },
  setUpdateCampPublic: async (targetCampId) => {
    try {
      const campHistory = get().campHistory;
      const targetCampPublicStatus = campHistory.find((camp: CampsTableType) => camp.id === targetCampId)?.is_public;

      // 서비스 호출
      await changeCampPublic(targetCampId);

      // 상태 업데이트
      set((state) => ({
        campHistory: state.campHistory.map((camp) =>
          camp.id === targetCampId ? { ...camp, is_public: !targetCampPublicStatus } : camp
        ),
      }));
    } catch {
      throw new Error("캠프 공개 여부 수정 실패");
    }
  },
  setDeleteCamp: async (targetCampId) => {
    try {
      // 서비스 호출
      await deleteCamp(targetCampId);

      // 상태 업데이트
      set((state) => ({
        campHistory: state.campHistory.filter((camp) => camp.id !== targetCampId),
      }));
    } catch {
      throw new Error("캠프 삭제 실패");
    }
  },
}));
