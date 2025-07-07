import { checkLineAssign, getAssignableInDormitory } from "@/hooks/assign/useAssignable";
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
  const { assignRoom, assignLine } = useAssign();

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
      assignRoom({ sex: "male", church: churchMaleArray[0], count: 1, floorIndex: 0, lineIndex: 0, roomIndex: 0 });
    }
  }

  function testFunc4() {
    if (churchMaleArray && churchFemaleArray && dormitoryData) {
      const assignableFloorIndexArray = getAssignableInDormitory({
        church: churchMaleArray[0],
        dormitory: dormitoryData,
      });
      console.log(`${churchMaleArray[0].churchName} 배정 가능 조회 결과 : \n ${JSON.stringify(assignableFloorIndexArray, null, 2)}`);
    }
  }

  function testFunc5() {
    if (churchMaleArray && churchFemaleArray && dormitoryData) {
      // 배정 가능 라인 조회
      const assignableFloorIndexArray = getAssignableInDormitory({
        church: churchMaleArray[0],
        dormitory: dormitoryData,
      });
      const assignFloorIndex = assignableFloorIndexArray[0].floorIndex;
      const assignLineIndex = assignableFloorIndexArray[0].lineIndexArray[0];

      alert(`${churchMaleArray[0].churchName} 배정 가능 라인 조회 결과 : \n ${assignFloorIndex}층 ${assignLineIndex}라인`);
      assignLine({ sex: "male", church: churchMaleArray[0], floorIndex: assignFloorIndex, lineIndex: assignLineIndex });
    }
  }

  useEffect(() => {
    console.log(dormitoryData);
  }, [dormitoryData]);

  return (
    <div>
      <div style={{ display: "flex", gap: "10px" }}>

      <button onClick={testFunc}>배정 가능 여부 확인</button>
      <button onClick={testFunc2}>배정 가능 층 조회</button>
      <button onClick={testFunc3}>방 배정</button>
      <button onClick={testFunc4}>배정 가능 라인 조회</button>
      <button onClick={testFunc5}>라인 자동 배정</button>
      </div>
      <h1>남자</h1>
      <pre>{JSON.stringify(churchMaleArray, null, 2)}</pre>
      <h1>여자</h1>
      <pre>{JSON.stringify(churchFemaleArray, null, 2)}</pre>
    </div>
  );
};

export default ChurchListContainer;
