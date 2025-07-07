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
