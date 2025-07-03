export type ChurchObject = {
  단체명: string;
  남자: number;
  단체명_1: string;
  여자: number;
};

export type FormattedExcelData = {
  maleDataArray: maleData[];

  femaleDataArray: femaleData[];
};

type maleData = {
  churchName: string;
  male: number;
};

type femaleData = {
  churchName: string;
  female: number;
};
