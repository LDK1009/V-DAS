import { checkLineAssign, getAssignableInDormitory } from "@/hooks/assign/useCheckAssign";
import { useAssign } from "@/hooks/assign/useAssign";
import { useCurrentChurchStore } from "@/store/church/churchStore";
import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { useExcelStore } from "@/store/excel/excelStore";
import { ChurchObject, FormattedExcelData } from "@/types/excel";
import { formatExcelData } from "@/utils/excel/format";
import { readExcelFile } from "@/utils/excel/read";
import React, { useEffect } from "react";

const ChurchListContainer = () => {
  const { excelFile } = useExcelStore();
  const { churchMaleArray, churchFemaleArray, setCurrentChurchMaleArray, setCurrentChurchFemaleArray } =
    useCurrentChurchStore();
  const { dormitoryData } = useDormitoryStore();
  const { assign } = useAssign();

  useEffect(() => {
    // 파일 형식 변환
    if (excelFile) {
      readExcelFile(excelFile).then((data: ChurchObject[]) => {
        const formattedData: FormattedExcelData = formatExcelData(data);

        setCurrentChurchMaleArray(formattedData.churchMaleArray);
        setCurrentChurchFemaleArray(formattedData.churchFemaleArray);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excelFile]);

  function testFunc() {
    if (churchMaleArray && churchFemaleArray && dormitoryData) {
      const isAvailable = checkLineAssign({
        church: churchMaleArray[0],
        line: dormitoryData.floors[0].lines[0],
      });
      console.log(isAvailable ? "배정 가능" : "배정 불가능");
    }
  }

  function testFunc2() {
    if (churchMaleArray && churchFemaleArray && dormitoryData) {
      const assignableFloorIndexArray = getAssignableInDormitory({
        church: churchMaleArray[1],
        dormitory: dormitoryData,
      });
      console.log(assignableFloorIndexArray);
    }
  }

  function testFunc3() {
    if (churchMaleArray && churchFemaleArray && dormitoryData) {
      assign({ church: churchMaleArray[0], count: 1, floorIndex: 0, lineIndex: 0, roomIndex: 0 });
    }
  }

  useEffect(() => {
    console.log(dormitoryData);
  }, [dormitoryData]);

  return (
    <div>
      <button onClick={testFunc}>테스트</button>
      <button onClick={testFunc2}>테스트2</button>
      <button onClick={testFunc3}>테스트3</button>
      <h1>남자</h1>
      <pre>{JSON.stringify(churchMaleArray, null, 2)}</pre>
      <h1>여자</h1>
      <pre>{JSON.stringify(churchFemaleArray, null, 2)}</pre>
    </div>
  );
};

export default ChurchListContainer;
