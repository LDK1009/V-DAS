import { ChurchType } from "./currentChurchType";
import { DormitoryType } from "./dormitory";

type DormitorySettingType = {
  useFloorNumbers: {
    male: number[];
    female: number[];
  };
  maxRoomPeople: number;
};

type ChurchListType = {
  male: ChurchType[];
  female: ChurchType[];
};

export type CampType = {
  round: number;
  dormitory_setting: DormitorySettingType;
  church_list: ChurchListType;
  dormitory: DormitoryType;
  is_public: boolean;
};

export type CampsTableType = {
  id: number;
  created_at: string;
  updated_at: string;
} & CampType;
