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

type TableRowType = {
  sex: "male" | "female";
  assignedInfo: {
    totalAssignedCount: number;
    floorNumber: number;
    startAssignedInfo: {
      roomNumber: number;
      assignedCount: number;
    };
    endAssignedInfo: {
      roomNumber: number;
      assignedCount: number;
    };
  };
} | null;

export type ChurchCardType = {
  churchName: string;
  maleCardInfo: TableRowType | null;
  femaleCardInfo: TableRowType | null;
};

export type CampType = {
  round: number;
  dormitory_setting: DormitorySettingType;
  church_list: ChurchListType;
  dormitory: DormitoryType;
  is_public: boolean;
  church_cards: ChurchCardType[];
};

export type CampsTableType = {
  id: number;
  created_at: string;
  updated_at: string;
} & CampType;
