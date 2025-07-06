export type CurrentChurchMaleArrayType = ChurchMaleType[];
export type CurrentChurchFemaleArrayType = ChurchFemaleType[];

export type ChurchType = ChurchMaleType | ChurchFemaleType;

export type ChurchMaleType = {
  churchName: string;
  male: number;
};

export type ChurchFemaleType = {
  churchName: string;
  female: number;
};
