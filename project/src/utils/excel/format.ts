import { ChurchObject, FormattedExcelData } from "@/types/excel";

export const formatExcelData = (data: ChurchObject[]) : FormattedExcelData => {
  const maleData = data
  .filter(el => el["남자"] > 0)
  .map(el => ({
    churchName: el["단체명"],
    people: el["남자"],
  }))
  .sort((a, b) => b.people - a.people);

  const femaleData = data
  .filter(el => el["여자"] > 0)
  .map(el => ({
    churchName: el["단체명"],
    people: el["여자"],
  }))
  .sort((a, b) => b.people - a.people);

  return { churchMaleArray: maleData, churchFemaleArray: femaleData };
};
