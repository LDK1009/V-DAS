import {
  checkLineAssign,
  getAssignableInDormitory,
  getLastAssignedRoomRemain,
} from "@/hooks/assign/useAssignable";
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
  const { assignRoom, assignLine, autoAssign, assignSmallChurch } = useAssign();

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
      });
      console.log(
        `${churchMaleArray[0].churchName} 배정 가능 조회 결과 : \n ${JSON.stringify(
          assignableFloorIndexArray,
          null,
          2
        )}`
      );
    }
  }

  function testFunc5(index: number) {
    if (churchMaleArray && churchFemaleArray && dormitoryData) {
      const church = churchMaleArray[index];
      // 배정 가능 라인 조회
      const assignableFloorIndexArray = getAssignableInDormitory({
        church: church,
      });

      let assignFloorIndex = 0;
      let assignLineIndex = 0;

      if (assignableFloorIndexArray) {
        assignFloorIndex = assignableFloorIndexArray[0].floorIndex;
        assignLineIndex = assignableFloorIndexArray[0].lineInfoArray[0].lineIndex;
      }

      alert(`${church.churchName} 배정 가능 라인 조회 결과 : \n ${assignFloorIndex}층 ${assignLineIndex}라인`);
      assignLine({ sex: "male", church: church, floorIndex: assignFloorIndex, lineIndex: assignLineIndex });
    }
  }

  function testFunc6() {
    const { dormitoryData, maxRoomPeople } = useDormitoryStore.getState();
    const { churchMaleArray, churchFemaleArray } = useCurrentChurchStore.getState();

    if (churchMaleArray && churchFemaleArray && dormitoryData) {
      if (!churchMaleArray) {
        return;
      }

      for (const { churchName, people } of churchMaleArray) {
        console.log("\n\n\n\n==========", `${churchName}(${people})`, "배정 시작==========");
        const { churchMaleArray: currentChurchMaleArray } = useCurrentChurchStore.getState();

        if (!currentChurchMaleArray) {
          continue;
        }

        const targetChurch = currentChurchMaleArray.filter((el) => el.churchName === churchName)[0];

        if (!targetChurch) {
          continue;
        }

        if (targetChurch.people <= 0) {
          console.log(`${targetChurch.churchName} | ${targetChurch.people} 인원이 0명 이하입니다. 배정 불가능`);
          continue;
        }

        if (targetChurch.people < maxRoomPeople) {
          assignSmallChurch({ sex: "male", church: targetChurch });
          continue;
        }

        // 자동배정
        autoAssign({ sex: "male", church: targetChurch });

        continue;
      }
    }
  }

  function testFunc7() {
    const lastAssignedRoomRemain = getLastAssignedRoomRemain({ floorIndex: 6, lineIndex: 4 });
    console.log(lastAssignedRoomRemain);
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
        <button onClick={() => testFunc5(0)}>라인 자동 배정</button>
        <button onClick={testFunc6}>전체 교회 자동 배정</button>
        <button onClick={testFunc7}>마지막 배정된 방 남은 인원 조회</button>
      </div>
      <h1>남자</h1>
      <pre>{JSON.stringify(churchMaleArray, null, 2)}</pre>
      <h1>여자</h1>
      <pre>{JSON.stringify(churchFemaleArray, null, 2)}</pre>
    </div>
  );
};

export default ChurchListContainer;
