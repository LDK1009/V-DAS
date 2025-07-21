import { ChurchArrayType } from "./currentChurchType";

export type ChurchObject = {
  단체명: string;
  남자: number;
  단체명_1: string;
  여자: number;
};

export type FormattedExcelData = {
  churchMaleArray: ChurchArrayType;
  churchFemaleArray: ChurchArrayType;
};

// 호수, 교회명, 인원, 교회명, 인원,....
export type AssignSheetRowType = (string | number)[];

export type AssignSheetFloorType = {
  floorNumber: number;
  totalCount: number;
  rows: AssignSheetRowType[];
};

export type AssignSheetType = {
  male: {
    totalCount: number;
    floors: AssignSheetFloorType[];
  };
  female: {
    totalCount: number;
    floors: AssignSheetFloorType[];
  };
};
