import { ChurchObject, FormattedExcelData } from "@/types/excel";

export const formatExcelData = (data: ChurchObject[]) : FormattedExcelData => {
  const maleData = data
  .filter(el => el["남자"] > 0)
  .map(el => ({
    churchName: el["단체명"],
    male: el["남자"],
  }))
  .sort((a, b) => b.male - a.male);

  const femaleData = data
  .filter(el => el["여자"] > 0)
  .map(el => ({
    churchName: el["단체명"],
    female: el["여자"],
  }))
  .sort((a, b) => b.female - a.female);

  return { maleDataArray: maleData, femaleDataArray: femaleData };
};
