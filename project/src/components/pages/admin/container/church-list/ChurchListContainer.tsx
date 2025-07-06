import { checkLineAssign, getAssignableInDormitory } from "@/hooks/assign/checkAssignAvailability";
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
  const { currentChurchMaleArray, currentChurchFemaleArray, setCurrentChurchMaleArray, setCurrentChurchFemaleArray } =
    useCurrentChurchStore();
  const { dormitoryData } = useDormitoryStore();
  const { assign } = useAssign();

  useEffect(() => {
    // 파일 형식 변환
    if (excelFile) {
      readExcelFile(excelFile).then((data: ChurchObject[]) => {
        const formattedData: FormattedExcelData = formatExcelData(data);

        setCurrentChurchMaleArray(formattedData.maleDataArray);
        setCurrentChurchFemaleArray(formattedData.femaleDataArray);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excelFile]);

  function testFunc() {
    if (currentChurchMaleArray && currentChurchFemaleArray && dormitoryData) {
      const isAvailable = checkLineAssign({
        church: currentChurchMaleArray[0],
        line: dormitoryData.floors[0].lines[0],
      });
      console.log(isAvailable ? "배정 가능" : "배정 불가능");
    }
  }

  function testFunc2() {
    if (currentChurchMaleArray && currentChurchFemaleArray && dormitoryData) {
      const assignableFloorIndexArray = getAssignableInDormitory({ church: currentChurchMaleArray[1], dormitory: dormitoryData });
      console.log(assignableFloorIndexArray);
    }
  }


  function testFunc3() {
    if (currentChurchMaleArray && currentChurchFemaleArray && dormitoryData) {
      assign({ church: currentChurchMaleArray[1], count: 1, floorIndex: 0, lineIndex: 0, roomIndex: 0 });
    }
  }

  return (
    <div>
      <button onClick={testFunc}>테스트</button>
      <button onClick={testFunc2}>테스트2</button>
      <button onClick={testFunc3}>테스트3</button>
      <pre>{JSON.stringify(currentChurchMaleArray, null, 2)}</pre>
      <pre>{JSON.stringify(currentChurchFemaleArray, null, 2)}</pre>
    </div>
  );
};

export default ChurchListContainer;
