import {
  checkLineAssign,
  getAssignableInDormitory,
  getAssignableNoTailLine,
  getFitAssignPoint,
  getRecommendedAssignmentPoint,
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
  const { dormitoryData, maxRoomPeople } = useDormitoryStore();
  const { assignRoom, assignLine, assignLineStartFromNextRoom } = useAssign();

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
      const assignFloorIndex = assignableFloorIndexArray[0].floorIndex;
      const assignLineIndex = assignableFloorIndexArray[0].lineInfoArray[0].lineIndex;

      alert(
        `${churchMaleArray[0].churchName} 배정 가능 라인 조회 결과 : \n ${assignFloorIndex}층 ${assignLineIndex}라인`
      );
      assignLine({ sex: "male", church: church, floorIndex: assignFloorIndex, lineIndex: assignLineIndex });
    }
  }

  function testFunc6() {
    if (churchMaleArray && churchFemaleArray && dormitoryData) {
      for (const church of churchMaleArray) {
        console.log("\n\n\n\n==========", `${church.churchName}(${church.people})`, "배정 시작==========");

        const churchPeople = church.people;

        // 배정 가능라인 조회
        const assignableFloorIndexArray = getAssignableInDormitory({
          church: church,
        });

        const assignableNoTailLine = getAssignableNoTailLine({ church });

        console.log(`${church.churchName} 배정 가능 라인 \n ${JSON.stringify(assignableNoTailLine, null, 2)}`);

        // const divisibleAssignableFloorIndexArray = getAssignableInDormitory({
        //   church: church,
        //   divisible: true,
        // });

        // console.log("assignableFloorIndexArray", assignableFloorIndexArray);
        // console.log("divisibleAssignableFloorIndexArray", divisibleAssignableFloorIndexArray);

        // /////////////////////////////////////////////////////////

        // 인원이 7미만이면 핏한 방 배정
        if (churchPeople < maxRoomPeople) {
          console.log("핏한 방 배정 시작");
          const fitAssignPoint = getFitAssignPoint({ church });
          const { assignType, floorIndex, lineIndex } = fitAssignPoint;

          if(assignType === "sequence") {
            assignLine({
              sex: "male",
              church: church,
              floorIndex,
              lineIndex,
            });
            continue;
          }
          
          if(assignType === "next") {
            assignLineStartFromNextRoom({
              sex: "male",
              church: church,
              floorIndex,
              lineIndex,
            });
            continue;
          }



          console.log(
            `핏한 방 배정 성공 ${church.churchName}${fitAssignPoint.floorIndex}층 ${fitAssignPoint.lineIndex}라인`
          );

          console.log("핏한 방 배정 완료");
          continue;
        }

        console.log("추천 배정 시작");

        // 추천 배정 지점
        const recommendedAssignmentPoint = getRecommendedAssignmentPoint({ church });

        if (!recommendedAssignmentPoint) {
          console.log("추천 배정 실패");
          continue;
        }

        assignLine({
          sex: "male",
          church: church,
          floorIndex: recommendedAssignmentPoint.floorIndex,
          lineIndex: recommendedAssignmentPoint.lineIndex,
        });

        console.log(
          `추천 배정 성공 ${church.churchName} ${recommendedAssignmentPoint.floorIndex}층 ${recommendedAssignmentPoint.lineIndex}라인`
        );
        console.log("추천 배정 완료");
        continue;

        // /////////////////////////////////////////////////////////
        // 배정 층
        // const assignFloorIndex = assignableFloorIndexArray[0].floorIndex;
        // 배정 라인
        // const assignLineIndex = assignableFloorIndexArray[0].lineInfoArray[0].lineIndex;
        // 교회 인원

        // 교회 인원이 방 최대 인원보다 작으면 찢어지지 않는 라인에 배정(maxRoomPeople로 나누어 떨어지는 라인)
        // if (maxRoomPeople > churchPeople) {
        //   if (divisibleAssignableFloorIndexArray.length > 0) {
        //     const divisibleAssignFloorIndex = divisibleAssignableFloorIndexArray[0].floorIndex;
        //     const divisibleAssignLineIndex = divisibleAssignableFloorIndexArray[0].lineInfoArray[0].lineIndex;

        //     console.log("배정 위치 : ", church.churchName, divisibleAssignFloorIndex, divisibleAssignLineIndex);

        //     assignLine({
        //       sex: "male",
        //       church: church,
        //       floorIndex: divisibleAssignFloorIndex,
        //       lineIndex: divisibleAssignLineIndex,
        //     });
        //   }

        //   console.log("==========", church.churchName, "배정 완료(찢어지지 않는 라인)==========");
        //   continue;
        // }

        // 라인배정
        // assignLine({
        //   sex: "male",
        //   church: church,
        //   floorIndex: assignFloorIndex,
        //   lineIndex: assignLineIndex,
        // });

        // 콘솔
        console.log(
          `${church.churchName} 배정 위치 : ${recommendedAssignmentPoint.floorIndex}층 ${recommendedAssignmentPoint.lineIndex}라인`
        );
        console.log("==========", church.churchName, "배정 완료==========");
      }
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
        <button onClick={() => testFunc5(0)}>라인 자동 배정</button>
        <button onClick={testFunc6}>전체 교회 자동 배정</button>
      </div>
      <h1>남자</h1>
      <pre>{JSON.stringify(churchMaleArray, null, 2)}</pre>
      <h1>여자</h1>
      <pre>{JSON.stringify(churchFemaleArray, null, 2)}</pre>
    </div>
  );
};

export default ChurchListContainer;
